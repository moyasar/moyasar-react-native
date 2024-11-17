import { PaymentType } from '../../../payment_type';
import type { PaymentRequestSource } from '../payment_request_source';

export class STCPayRequestSource implements PaymentRequestSource {
  type: PaymentType = PaymentType.stcPay;
  mobile: string;

  constructor({ mobile }: { mobile: string }) {
    this.mobile = mobile;
  }

  toJson(): Record<string, any> {
    return {
      type: this.type,
      mobile: this.mobile,
    };
  }
}
