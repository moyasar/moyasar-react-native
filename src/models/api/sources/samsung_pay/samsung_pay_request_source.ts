import { PaymentType } from '../../../payment_type';
import type { PaymentRequestSource } from '../payment_request_source';

export class SamsungPayRequestSource implements PaymentRequestSource {
  type: PaymentType = PaymentType.samsungPay;
  samsungPayToken: string;
  manualPayment: string;

  constructor({
    samsungPayToken: samsungPayToken,
    manualPayment = false,
  }: {
    samsungPayToken: string;
    manualPayment?: boolean;
  }) {
    this.samsungPayToken = samsungPayToken;
    this.manualPayment = manualPayment ? 'true' : 'false';
  }

  toJson(): Record<string, any> {
    return {
      type: this.type,
      token: this.samsungPayToken,
      manual: this.manualPayment,
    };
  }
}
