import PaymentType from '../../../payment_type';
import type { PaymentRequestSource } from '../payment_request_source';

export class ApplePayPaymentRequestSource implements PaymentRequestSource {
  type: PaymentType = PaymentType.applePay;
  applePayToken: string;
  manualPayment: string;

  constructor({
    applePayToken,
    manualPayment = false,
  }: {
    applePayToken: string;
    manualPayment?: boolean;
  }) {
    this.applePayToken = applePayToken;
    this.manualPayment = manualPayment ? 'true' : 'false';
  }

  toJson(): Record<string, any> {
    return {
      type: this.type,
      token: this.applePayToken,
      manual: this.manualPayment,
    };
  }
}
