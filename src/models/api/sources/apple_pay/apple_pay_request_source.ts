import { PaymentType } from '../../../payment_type';
import type { PaymentRequestSource } from '../payment_request_source';

export class ApplePayRequestSource implements PaymentRequestSource {
  type: PaymentType = PaymentType.applePay;
  applePayToken: string;
  manualPayment: string;
  saveCard?: boolean;

  constructor({
    applePayToken,
    manualPayment = false,
    saveCard = false,
  }: {
    applePayToken: string;
    manualPayment?: boolean;
    saveCard?: boolean;
  }) {
    this.applePayToken = applePayToken;
    this.manualPayment = manualPayment ? 'true' : 'false';
    this.saveCard = saveCard;
  }

  toJson(): Record<string, any> {
    return {
      type: this.type,
      token: this.applePayToken,
      manual: this.manualPayment,
      save_card: this.saveCard,
    };
  }
}
