import type { PaymentConfig } from './payment_config';
import type { ResultCallback } from './payment_result';

export interface MoyasarProps {
  paymentConfig: PaymentConfig;
  onPaymentResult: ResultCallback;
}
