import type { MoyasarError } from './errors/moyasar_errors';
import type { PaymentConfig } from './payment_config';
import type { PaymentResponse } from './payment_response';

export interface MoyasarProps {
  paymentConfig: PaymentConfig;
  onPaymentResult: (paymentResponse: PaymentResponse | MoyasarError) => void;
}
