import type { PaymentConfig } from './payment_config';

export interface CreditCardProps {
  paymentConfig: PaymentConfig;
  onPaymentResult: (result: any) => void;
  setWebviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
