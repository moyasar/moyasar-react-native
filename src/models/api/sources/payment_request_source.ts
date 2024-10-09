import type PaymentType from '../../payment_type';

export interface PaymentRequestSource {
  type: PaymentType;

  toJson(): Record<string, any>;
}
