import { debugLog, errorLog } from '../helpers/debug_log';
import { ExpiryDateUtil } from '../helpers/expiry_date_util';
import type { PaymentConfig } from '../models/payment_config';
import { PaymentRequest } from '../models/api/api_requests/payment_request';
import type { PaymentResponse } from '../models/api/api_responses/payment_response';
import { CreditCardRequestSource } from '../models/api/sources/credit_card/credit_card_request_source';
import type { CreditCardFields } from '../models/component_models/credit_card_fields';
import { createPayment, createToken } from './payment_service';
import { CreditCardCvcValidator } from './validators/credit_card_cvc_validator';
import { CreditCardExpiryValidator } from './validators/credit_card_expiry_validator';
import { CreditCardNameValidator } from './validators/credit_card_name_validator';
import { CreditCardNumberValidator } from './validators/credit_card_number_validator';
import { PaymentStatus } from '../models/payment_status';
import { CreditCardNetwork } from '../models/credit_card_network';
import { getCreditCardNetworkFromNumber } from '../helpers/credit_card_utils';
import { isMoyasarError } from '../models/errors/moyasar_errors';
import { TokenRequest } from '../models/api/api_requests/token_request';
import type { ResultCallback } from '../models/payment_result';

export class CreditCardPaymentService {
  payment: PaymentResponse | null = null;

  nameValidator = new CreditCardNameValidator();
  numberValidator = new CreditCardNumberValidator();
  expiryValidator = new CreditCardExpiryValidator();
  cvcValidator = new CreditCardCvcValidator();

  shouldShowNetworkLogo(number: string, network: CreditCardNetwork): boolean {
    const inferredNetwork = getCreditCardNetworkFromNumber(number);

    switch (inferredNetwork) {
      case CreditCardNetwork.unknown:
        return true;
      default:
        return inferredNetwork === network;
    }
  }

  /**
   * @returns {Promise<boolean>} - Returns true if should show the 3DS webview.
   */
  async beginTransaction(
    paymentConfig: PaymentConfig,
    fields: CreditCardFields,
    onPaymentResult: ResultCallback
  ): Promise<boolean> {
    debugLog('Moyasar SDK: Begin CC transaction...');

    if (!this.validateAllFields(fields)) {
      // TODO: Alert user about invalid fields
      return false;
    }

    const expiryDate = ExpiryDateUtil.fromPattern(fields.expiry);

    if (expiryDate === null) {
      // TODO: Alert user about invalid fields
      return false;
    }

    const creditCardRequestSource: CreditCardRequestSource =
      new CreditCardRequestSource({
        name: fields.name,
        number: fields.number,
        cvc: fields.cvc,
        month: expiryDate.month.toString(),
        year: expiryDate.year.toString(),
        tokenizeCard: paymentConfig.creditCard.saveCard,
        manualPayment: paymentConfig.creditCard.manual,
      });

    if (paymentConfig.createSaveOnlyToken) {
      await this.beginSaveOnlyToken(
        paymentConfig,
        creditCardRequestSource,
        onPaymentResult
      );
      return false;
    } else {
      return this.beginCcPayment(
        paymentConfig,
        creditCardRequestSource,
        onPaymentResult
      );
    }
  }

  async beginCcPayment(
    paymentConfig: PaymentConfig,
    creditCardRequestSource: CreditCardRequestSource,
    onPaymentResult: ResultCallback
  ): Promise<boolean> {
    debugLog('Moyasar SDK: Begin CC payment process...');

    const paymentRequest = new PaymentRequest({
      givenId: paymentConfig.givenId,
      amount: paymentConfig.amount,
      currency: paymentConfig.currency,
      description: paymentConfig.description,
      metadata: paymentConfig.metadata,
      source: creditCardRequestSource,
      callbackUrl: 'https://sdk.moyasar.com/return',
    });

    const response = await createPayment(
      paymentRequest,
      paymentConfig.publishableApiKey
    );

    if (isMoyasarError(response)) {
      errorLog(`Moyasar SDK: CC Payment failed with error: ${response}`);
      onPaymentResult(response);

      return false;
    }

    debugLog(`Moyasar SDK: CC Payment created with status: ${response.status}`);

    if (response.status != PaymentStatus.initiated) {
      onPaymentResult(response);
      return false;
    }

    this.payment = response;

    return true;
  }

  async beginSaveOnlyToken(
    paymentConfig: PaymentConfig,
    creditCardRequestSource: CreditCardRequestSource,
    onPaymentResult: ResultCallback
  ): Promise<void> {
    debugLog('Moyasar SDK: Begin create save only token process...');

    const tokenRequest = new TokenRequest({
      name: creditCardRequestSource.name,
      number: creditCardRequestSource.number,
      cvc: creditCardRequestSource.cvc,
      month: creditCardRequestSource.month,
      year: creditCardRequestSource.year,
      callbackUrl: 'https://sdk.moyasar.com/return',
      metadata: paymentConfig.metadata,
    });

    const response = await createToken(
      tokenRequest,
      paymentConfig.publishableApiKey
    );

    if (isMoyasarError(response)) {
      errorLog(`Moyasar SDK: Save only token failed with error: ${response}`);
      onPaymentResult(response);

      return;
    }

    debugLog(`Moyasar SDK: CC token created with status: ${response.status}`);

    onPaymentResult(response);
  }

  validateAllFields(fields: CreditCardFields): boolean {
    const validations = [
      this.nameValidator.validate(fields.name),
      this.numberValidator.validate(fields.number),
      this.expiryValidator.validate(fields.expiry),
      this.cvcValidator.validate(fields.cvc, fields.number),
    ];

    return validations.every((validation) => validation === null);
  }
}
