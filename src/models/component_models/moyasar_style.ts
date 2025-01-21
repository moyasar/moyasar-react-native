import { type ColorValue, type TextStyle, type ViewStyle } from 'react-native';

export interface CreditCardMoyasarStyle {
  container?: ViewStyle;
  textInputs?: TextStyle;
  textInputsPlaceholderColor?: ColorValue;
  paymentButton?: ViewStyle;
  paymentButtonText?: TextStyle;
  errorText?: TextStyle;
  activityIndicatorColor?: ColorValue;
  webviewActivityIndicatorColor?: ColorValue; // Loading indicator color for 3DS webview
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
  textInputs?: TextStyle;
  textInputsPlaceholderColor?: ColorValue;
  paymentButton?: ViewStyle;
  paymentButtonText?: TextStyle;
  errorText?: TextStyle;
  activityIndicatorColor?: ColorValue;
}
