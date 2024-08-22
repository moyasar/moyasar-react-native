import type { PaymentConfig } from './payment_config';

export interface MoyasarProps {
  paymentConfig: PaymentConfig;
  onPaymentResult: (paymentResponse: any) => void;
}
