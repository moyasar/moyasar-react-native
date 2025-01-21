import type {
  ApplePayMoyasarStyle,
  CreditCardMoyasarStyle,
  StcPayMoyasarStyle,
} from './moyasar_style';
import type { PaymentConfig } from '../payment_config';
import type { ResultCallback } from '../payment_result';

export interface CreditCardProps {
  paymentConfig: PaymentConfig;
  onPaymentResult: ResultCallback;
  style?: CreditCardMoyasarStyle;
}

export interface ApplePayProps {
  paymentConfig: PaymentConfig;
  onPaymentResult: ResultCallback;
  style?: ApplePayMoyasarStyle;
}

export interface StcPayProps {
  paymentConfig: PaymentConfig;
  onPaymentResult: ResultCallback;
  style?: StcPayMoyasarStyle;
}
