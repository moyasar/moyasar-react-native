import {
  type ColorValue,
  type DimensionValue,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

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

/**
 * Height and width can accept relative values (like '100%') or absolute values (like 50).
 */
export interface ApplePayMoyasarStyle {
  buttonType?: string; // 'plain' | 'buy' | 'inStore' | 'donate' | 'setUp'
  buttonStyle?: string; // 'black' | 'white' | 'whiteOutline'
  height?: DimensionValue;
  width?: DimensionValue;
  cornerRadius?: number;
}

/**
 * Height and width can accept relative values (like '100%') or absolute values (like 50).
 */
export interface SamsungPayMoyasarStyle {
  height?: DimensionValue;
  width?: DimensionValue;
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
