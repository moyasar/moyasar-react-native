import { debugLog } from '../helpers/debug_log';
import { ExpiryDateUtil } from '../helpers/expiry_date_util';
import type { PaymentConfig } from '../models/payment_config';
import PaymentRequest from '../models/payment_request';
import type { PaymentResponse } from '../models/payment_response';
import CreditCardRequestSource from '../models/sources/credit_card/credit_card_request_source';
import type { CreditCardFields } from '../models/component_models/credit_card_fields';
import { createPayment } from './payment_service';
import { CreditCardCvcValidator } from './validators/credit_card_cvc_validator';
import { CreditCardExpiryValidator } from './validators/credit_card_expiry_validator';
import { CreditCardNameValidator } from './validators/credit_card_name_validator';
import { CreditCardNumberValidator } from './validators/credit_card_number_validator';
import PaymentStatus from '../models/payment_status';

export class CreditCardPaymentService {
  payment: PaymentResponse | null = null;

  nameValidator = new CreditCardNameValidator();
  numberValidator = new CreditCardNumberValidator();
  expiryValidator = new CreditCardExpiryValidator();
  cvcValidator = new CreditCardCvcValidator();

  async payByCreditCard(
    paymentConfig: PaymentConfig,
    fields: CreditCardFields,
    onPaymentResult: (onPaymentResult: PaymentResponse) => void
  ): Promise<boolean> {
    debugLog('Moyasar SDK: Begin CC payment...');

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
        month: expiryDate?.month.toString(),
        year: expiryDate?.year.toString(),
        tokenizeCard: paymentConfig.creditCard?.saveCard ?? false,
        manualPayment: paymentConfig.creditCard?.manual ?? false,
      });

    debugLog('Moyasar SDK: Paying...');

    const paymentRequest = new PaymentRequest({
      config: paymentConfig,
      source: creditCardRequestSource,
      callbackUrl: 'https://sdk.moyasar.com/return',
    });

    const paymentResponse = await createPayment(
      paymentRequest,
      paymentConfig.publishableApiKey
    );

    debugLog(
      `Moyasar SDK: Payment done with status: ${paymentResponse.status}`
    );

    if (paymentResponse.status !== PaymentStatus.initiated) {
      onPaymentResult(paymentResponse);
      return false;
    }

    this.payment = paymentResponse;

    return true;
  }

  validateAllFields(fields: CreditCardFields): boolean {
    const validations = [
      this.nameValidator.validate(fields.name),
      this.numberValidator.validate(fields.number),
      this.expiryValidator.validate(fields.expiry),
      this.cvcValidator.validate(fields.cvc),
    ];

    return validations.every((validation) => validation === null);
  }
}
