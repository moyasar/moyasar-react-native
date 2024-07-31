import type { PaymentConfig } from './payment_config';
import type { PaymentResponse } from './payment_response';

export interface CreditCardProps {
  paymentConfig: PaymentConfig;
  onPaymentResult: (result: PaymentResponse) => void;
  setWebviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
