import { View, TextInput } from 'react-native';
import {
  getConfiguredLocalizations,
  isArabicLang,
} from '../../../localizations/i18n';
import { formatCreditCardNumber } from '../../../helpers/formatters';
import { getCreditCardNetworkFromNumber } from '../../../helpers/credit_card_utils';
import { mapArabicNumbers } from '../../../helpers/arabic_numbers_mapper';
import { CreditCardNetwork } from '../../../models/credit_card_network';
import { Visa } from '../../../assets/visa';
import { Mastercard } from '../../../assets/mastercard';
import { Amex } from '../../../assets/amex';
import { Mada } from '../../../assets/mada';
import { useTheme } from '../theme_context';
import { cardNumberInputStyles } from '../styles/card_number_input.styles';
import type { CardNumberInputProps } from '../types';
import { paymentService } from '../payment_service_instance';

export const CardNumberInput = ({
  value,
  onChangeText,
  onSubmitEditing,
  inputRef,
  disabled,
  supportedNetworks,
}: CardNumberInputProps) => {
  const { t } = getConfiguredLocalizations();
  const { themeColors, customStyle } = useTheme();

  const handleChange = (newValue: string) => {
    const cleanNumber = newValue
      .replace(/\s/g, '')
      .replace(/[^\d٠-٩]/gi, '')
      .slice(0, 16);

    const mappedCleanNumbers = mapArabicNumbers(cleanNumber);
    onChangeText(mappedCleanNumbers);
  };

  return (
    <View style={cardNumberInputStyles.groupRowTop}>
      <TextInput
        style={[
          {
            ...cardNumberInputStyles.groupInput,
            color: themeColors.text,
          },
          customStyle?.groupedTextInputs,
        ]}
        value={formatCreditCardNumber(value)}
        ref={inputRef}
        returnKeyType="next"
        onSubmitEditing={onSubmitEditing}
        onChangeText={handleChange}
        placeholder={t('moyasarTranslation:cardNumberPlaceholder')}
        placeholderTextColor={
          customStyle?.textInputsPlaceholderColor ?? themeColors.placeholder
        }
        keyboardType="numeric"
        editable={!disabled}
        maxLength={
          getCreditCardNetworkFromNumber(value) === CreditCardNetwork.amex
            ? 17
            : 19
        }
        textAlign={isArabicLang() ? 'right' : 'left'}
        accessibilityLabel={t('moyasarTranslation:cardNumberPlaceholder')}
        testID="moyasar-card-number-input"
      />
      <View style={cardNumberInputStyles.cardNetworkLogoContainer}>
        {paymentService.shouldShowNetworkLogo(
          value,
          CreditCardNetwork.mada,
          supportedNetworks
        ) ? (
          <Mada style={cardNumberInputStyles.cardNetworkLogo} />
        ) : null}

        {paymentService.shouldShowNetworkLogo(
          value,
          CreditCardNetwork.visa,
          supportedNetworks
        ) ? (
          <Visa style={cardNumberInputStyles.cardNetworkLogo} />
        ) : null}

        {paymentService.shouldShowNetworkLogo(
          value,
          CreditCardNetwork.master,
          supportedNetworks
        ) ? (
          <Mastercard style={cardNumberInputStyles.cardNetworkLogo} />
        ) : null}

        {paymentService.shouldShowNetworkLogo(
          value,
          CreditCardNetwork.amex,
          supportedNetworks
        ) ? (
          <Amex style={cardNumberInputStyles.cardNetworkLogo} />
        ) : null}
      </View>
    </View>
  );
};
