import { debugLog, errorLog } from '../helpers/debug_log';
import { validateField } from '../helpers/validation';
import { PaymentRequest } from '../models/api/api_requests/payment_request';
import type { PaymentResponse } from '../models/api/api_responses/payment_response';
import { STCPayRequestSource } from '../models/api/sources/stc_pay/stc_pay_request_source';
import { STCPayResponseSource } from '../models/api/sources/stc_pay/stc_pay_response_source';
import {
  isMoyasarError,
  UnexpectedError,
} from '../models/errors/moyasar_errors';
import type { PaymentConfig } from '../models/payment_config';
import type { ResultCallback } from '../models/payment_result';
import { PaymentStatus } from '../models/payment_status';
import { createPayment, sendOTP } from './payment_service';
import { OTPValidator } from './validators/otp_validator';
import { PhoneNumberValidator } from './validators/phone_number_validator';

export class StcPayService {
  payment: PaymentResponse | null = null;

  phoneNumberValidator = new PhoneNumberValidator();
  otpValidator = new OTPValidator();

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

    const stcPayRequestSource = new STCPayRequestSource({
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

    // TODO: Should handle if the mobile is not registered?

    if (isMoyasarError(response)) {
      errorLog(`Moyasar SDK: STC Payment failed with error: ${response}`);
      onPaymentResult(response);

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
      !(currentPayment.source instanceof STCPayResponseSource)
    ) {
      errorLog('Moyasar SDK: STC Payment OTP submission failed');
      onPaymentResult(
        new UnexpectedError('STC Payment OTP submission failed', currentPayment)
      );

      return;
    }

    const response = await sendOTP(otp, currentPayment.source.transactionUrl);

    // TODO: Handle wrong OTP error

    if (isMoyasarError(response)) {
      errorLog(
        `Moyasar SDK: STC Payment OTP submission response failed with error: ${response}`
      );
      onPaymentResult(response);

      return;
    }

    debugLog(
      `Moyasar SDK: STC Payment created with status: ${response.status}`
    );

    onPaymentResult(response);
  }
}
