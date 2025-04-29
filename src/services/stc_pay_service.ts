import { Alert } from 'react-native';
import { debugLog, errorLog } from '../helpers/debug_log';
import { validateField } from '../helpers/validation';
import { PaymentRequest } from '../models/api/api_requests/payment_request';
import type { PaymentResponse } from '../models/api/api_responses/payment_response';
import { StcPayRequestSource } from '../models/api/sources/stc_pay/stc_pay_request_source';
import { StcPayResponseSource } from '../models/api/sources/stc_pay/stc_pay_response_source';
import {
  isMoyasarError,
  UnexpectedError,
} from '../models/errors/moyasar_errors';
import type { PaymentConfig } from '../models/payment_config';
import type { ResultCallback } from '../models/payment_result';
import { PaymentStatus } from '../models/payment_status';
import { createPayment, sendOtp } from './payment_service';
import { OtpValidator } from './validators/otp_validator';
import { PhoneNumberValidator } from './validators/phone_number_validator';
import { getConfiguredLocalizations } from '../localizations/i18n';

export class StcPayService {
  payment: PaymentResponse | null = null;

  readonly phoneNumberValidator = new PhoneNumberValidator();
  readonly otpValidator = new OtpValidator();

  /**
   * @returns {Promise<boolean>} True if the payment process is initiated and should proceed to OTP entry.
   */
  async beginStcPayment(
    paymentConfig: PaymentConfig,
    phonerNumber: string,
    onPaymentResult: ResultCallback
  ): Promise<boolean> {
    debugLog('Moyasar SDK: Begin STC payment process...');

    if (!validateField(phonerNumber, this.phoneNumberValidator)) {
      debugLog('Moyasar SDK: Invalid phone number');
      // TODO: Alert user about invalid fields
      return false;
    }

    const stcPayRequestSource = new StcPayRequestSource({
      mobile: phonerNumber,
    });

    const paymentRequest = new PaymentRequest({
      amount: paymentConfig.amount,
      currency: paymentConfig.currency,
      description: paymentConfig.description,
      metadata: paymentConfig.metadata,
      source: stcPayRequestSource,
    });

    const response = await createPayment(
      paymentRequest,
      paymentConfig.publishableApiKey
    );

    if (isMoyasarError(response)) {
      errorLog(`Moyasar SDK: STC Payment failed with error: ${response}`);
      onPaymentResult(response);

      return false;
    }

    if (response.status == PaymentStatus.failed) {
      debugLog('Moyasar SDK: STC payment failed');

      if (
        (response.source as StcPayResponseSource).message?.includes(
          'Mobile number is not registered'
        )
      ) {
        debugLog(`Moyasar SDK: Phone number is not registered`);

        const { t } = getConfiguredLocalizations();

        Alert.alert(
          t('phoneNumberNotRegisteredTitle'),
          t('phoneNumberNotRegisteredBody')
        );
      } else {
        onPaymentResult(response);
      }

      return false;
    }

    debugLog(
      `Moyasar SDK: STC Payment created with status: ${response.status}`
    );

    if (response.status != PaymentStatus.initiated) {
      onPaymentResult(response);
      return false;
    }

    this.payment = response;

    return true;
  }

  async submitStcPaymentOtp(
    otp: string,
    onPaymentResult: ResultCallback
  ): Promise<void> {
    debugLog('Moyasar SDK: Submitting STC payment OTP...');

    if (!validateField(otp, this.otpValidator)) {
      debugLog('Moyasar SDK: Invalid OTP');
      // TODO: Alert user about invalid fields
      return;
    }

    const currentPayment = this.payment;

    if (
      currentPayment == null ||
      !(currentPayment.source instanceof StcPayResponseSource)
    ) {
      errorLog('Moyasar SDK: STC Payment OTP submission failed');
      onPaymentResult(
        new UnexpectedError('STC Payment OTP submission failed', currentPayment)
      );

      return;
    }

    const response = await sendOtp(otp, currentPayment.source.transactionUrl);

    // TODO: Refactor to handle `instanceof PaymentResponse` to check for success rather than `isMoyasarError`
    if (isMoyasarError(response)) {
      errorLog(
        `Moyasar SDK: STC Payment OTP submission response failed with error: ${response}`
      );
      onPaymentResult(response);

      return;
    }

    debugLog(
      `Moyasar SDK: STC Payment succeeded after OTP with status: ${response.status}`
    );

    onPaymentResult(response);
  }
}
