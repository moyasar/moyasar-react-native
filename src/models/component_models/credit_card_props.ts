import type { PaymentConfig } from '../payment_config';
import type { ResultCallback } from '../payment_result';

export interface CreditCardProps {
  paymentConfig: PaymentConfig;
  onPaymentResult: ResultCallback;
  setWebviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
