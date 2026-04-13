import { PaymentType } from '../../../payment_type';
import type { PaymentRequestSource } from '../payment_request_source';

export class SamsungPayRequestSource implements PaymentRequestSource {
  type: PaymentType = PaymentType.samsungPay;
  samsungPayToken: string;
  manualPayment: string;
  saveCard?: boolean;

  constructor({
    samsungPayToken,
    manualPayment = false,
    saveCard = false,
  }: {
    samsungPayToken: string;
    manualPayment?: boolean;
    saveCard?: boolean;
  }) {
    this.samsungPayToken = samsungPayToken;
    this.manualPayment = manualPayment ? 'true' : 'false';
    this.saveCard = saveCard;
  }

  toJson(): Record<string, any> {
    return {
      type: this.type,
      token: this.samsungPayToken,
      manual: this.manualPayment,
      save_card: this.saveCard,
    };
  }
}
