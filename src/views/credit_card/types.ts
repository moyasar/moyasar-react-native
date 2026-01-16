import type { TextInput } from 'react-native';
import type { CreditCardMoyasarStyle } from '../../models/component_models/moyasar_style';
import type { ThemeColors } from '../../models/component_models/theme_colors';

export type FieldRef = React.RefObject<TextInput | null>;

export interface FieldLabelProps {
  labelText: string;
  /** Error message to show (replaces label when present) */
  errorText: string | null;
  /** Whether the field is empty (shows "REQUIRED" indicator) */
  isEmpty: boolean;
}

export interface NameInputProps {
  /** Current name value */
  value: string;
  /** Validation error message */
  error: string | null;
  isEmpty: boolean;
  onChangeText: (value: string) => void;
  onSubmitEditing: () => void;
  inputRef: FieldRef;
  /** Whether the input is disabled */
  disabled: boolean;
}

export interface CardNumberInputProps {
  value: string;
  onChangeText: (value: string) => void;
  /** Callback to update CVC validation (for card type changes) */
  onCvcValidationChange: (error: string | null) => void;
  /** Callback when keyboard submit button is pressed */
  onSubmitEditing: () => void;
  inputRef: FieldRef;
  disabled: boolean;
  /** List of supported card networks (visa, mastercard, etc.) */
  supportedNetworks: string[];
  cvc: string;
}

export interface CardDetailsRowProps {
  expiry: string;
  cvc: string;
  /** Card number (used to determine CVC max length) */
  cardNumber: string;
  onExpiryChange: (value: string) => void;
  onCvcChange: (value: string) => void;
  onExpirySubmit: () => void;
  onCvcSubmit: () => void;
  expiryInputRef: FieldRef;
  cvcInputRef: FieldRef;
  disabled: boolean;
  /** Whether any card field has an error (for styling) */
  hasError: boolean;
}

export interface CardGroupContainerProps {
  cardNumber: string;
  // TODO: Why error for every input type?
  cardNumberError: string | null;
  expiry: string;
  expiryError: string | null;
  cvc: string;
  cvcError: string | null;
  onCardNumberChange: (value: string) => void;
  /** Callback to update CVC validation (for card type changes) */
  onCvcValidationChange: (error: string | null) => void;
  onExpiryChange: (value: string) => void;
  onCvcChange: (value: string) => void;
  onCardNumberSubmit: () => void;
  onExpirySubmit: () => void;
  onCvcSubmit: () => void;
  cardNumberInputRef: FieldRef;
  expiryInputRef: FieldRef;
  cvcInputRef: FieldRef;
  disabled: boolean;
  /** List of supported card networks */
  supportedNetworks: string[];
}

export interface PaymentButtonProps {
  disabled: boolean;
  loading: boolean;
  amount: number;
  currency: string;
  onPress: () => void;
}

export interface MoyasarLogoProps {
  isPortrait: boolean;
}

export interface ThemeContextValue {
  themeColors: ThemeColors;
  customStyle?: CreditCardMoyasarStyle;
}
