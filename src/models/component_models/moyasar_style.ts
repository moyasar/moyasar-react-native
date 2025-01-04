import { type TextStyle, type ViewStyle } from 'react-native';

export interface CreditCardMoyasarStyle {
  container?: ViewStyle;
  textInputs?: TextStyle;
  paymentButton?: ViewStyle;
  paymentButtonText?: TextStyle;
  errorText?: TextStyle;
}

export interface ApplePayMoyasarStyle {
  buttonType?: string; // 'plain' | 'buy' | 'inStore' | 'donate' | 'setUp'
  buttonStyle?: string; // 'black' | 'white' | 'whiteOutline'
  height?: string | number;
  width?: string | number;
  cornerRadius?: number;
}

export interface StcPayMoyasarStyle {
  container?: ViewStyle;
  title?: TextStyle;
  textInput?: TextStyle;
  paymentButton?: ViewStyle;
  paymentButtonText?: TextStyle;
  errorText?: TextStyle;
}
