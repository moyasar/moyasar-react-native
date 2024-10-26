import { type TextStyle, type ViewStyle } from 'react-native';

export interface CreditCardMoyasarStyle {
  textInputs?: TextStyle;
  paymentButton?: ViewStyle;
  paymentButtonText?: TextStyle;
  errorText?: TextStyle;
}

export interface ApplePayMoyasarStyle {
  buttonType?: string; // 'plain' | 'buy' | 'inStore' | 'donate' | 'setUp'
  buttonStyle?: string; // 'black' | 'white' | 'whiteOutline'
  height?: number;
  width?: number;
  cornerRadius?: number;
}
