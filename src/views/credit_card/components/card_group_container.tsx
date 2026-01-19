import { View, Platform } from 'react-native';
import { useTheme } from '../theme_context';
import { CardNumberInput } from './card_number_input';
import { CardDetailsRow } from './card_details_row';
import { cardGroupContainerStyles } from '../styles/card_group_container.styles';
import type { CardGroupContainerProps } from '../types';
import {
  getInputBorderStyle,
  getDividerStyle,
} from '../../../helpers/styles_utils';

export const CardGroupContainer = ({
  cardNumber,
  cardNumberError,
  expiry,
  expiryError,
  cvc,
  cvcError,
  onCardNumberChange,
  onCvcValidationChange,
  onExpiryChange,
  onCvcChange,
  onCardNumberSubmit,
  onExpirySubmit,
  onCvcSubmit,
  cardNumberInputRef,
  expiryInputRef,
  cvcInputRef,
  disabled,
  supportedNetworks,
}: CardGroupContainerProps) => {
  const { themeColors, customStyle } = useTheme();

  // Get the active card error in priority order (number, expiry, cvc)
  const getActiveCardError = () => {
    if (cardNumberError) return cardNumberError;
    if (expiryError) return expiryError;
    if (cvcError) return cvcError;
    return null;
  };

  const cardError = getActiveCardError();

  const handleCardNumberChange = (value: string) => {
    onCardNumberChange(value);
  };

  const handleExpiryChange = (value: string) => {
    onExpiryChange(value);
  };

  const handleCvcChange = (value: string) => {
    onCvcChange(value);
  };

  return (
    <View
      style={
        Platform.OS === 'ios'
          ? cardGroupContainerStyles.cardGroupShadowWrapper
          : {}
      }
    >
      <View
        style={[
          {
            ...cardGroupContainerStyles.cardGroup,
            ...getInputBorderStyle(!!cardError, themeColors),
            backgroundColor: themeColors.inputBackground,
          },
          customStyle?.groupedTextInputsContainer,
        ]}
      >
        <CardNumberInput
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          onCvcValidationChange={onCvcValidationChange}
          onSubmitEditing={onCardNumberSubmit}
          inputRef={cardNumberInputRef}
          disabled={disabled}
          supportedNetworks={supportedNetworks}
          cvc={cvc}
        />

        <View
          style={[
            {
              ...cardGroupContainerStyles.dividerHorizontal,
              ...getDividerStyle(!!cardError, themeColors),
            },
            customStyle?.groupedTextInputsDividers,
          ]}
        />

        <CardDetailsRow
          expiry={expiry}
          cvc={cvc}
          cardNumber={cardNumber}
          onExpiryChange={handleExpiryChange}
          onCvcChange={handleCvcChange}
          onExpirySubmit={onExpirySubmit}
          onCvcSubmit={onCvcSubmit}
          expiryInputRef={expiryInputRef}
          cvcInputRef={cvcInputRef}
          disabled={disabled}
          hasError={!!cardError}
        />
      </View>
    </View>
  );
};
