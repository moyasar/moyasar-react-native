import { View, TextInput } from 'react-native';
import {
  getConfiguredLocalizations,
  isArabicLang,
} from '../../../localizations/i18n';
import { formatExpiryDate } from '../../../helpers/formatters';
import { mapArabicNumbers } from '../../../helpers/arabic_numbers_mapper';
import { getCreditCardNetworkFromNumber } from '../../../helpers/credit_card_utils';
import { CreditCardNetwork } from '../../../models/credit_card_network';
import { useTheme } from '../theme_context';
import { cardDetailsRowStyles } from '../styles/card_details_row.styles';
import type { CardDetailsRowProps } from '../types';
import { getDividerStyle } from '../../../helpers/styles_utils';

export const CardDetailsRow = ({
  expiry,
  cvc,
  cardNumber,
  onExpiryChange,
  onCvcChange,
  onExpirySubmit,
  onCvcSubmit,
  expiryInputRef,
  cvcInputRef,
  disabled,
  hasError,
}: CardDetailsRowProps) => {
  const { t } = getConfiguredLocalizations();
  const { themeColors, customStyle } = useTheme();

  const handleExpiryChange = (value: string) => {
    const cleanExpiryDate = value
      .replace(/[\s\/]/g, '')
      .replace(/[^\d٠-٩]/gi, '')
      .slice(0, 6);

    const mappedCleanExpiryDate = mapArabicNumbers(cleanExpiryDate);
    onExpiryChange(mappedCleanExpiryDate);
  };

  const handleCvcChange = (value: string) => {
    const cleanCvc = value.replace(/\s/g, '').replace(/[^\d٠-٩]/gi, '');

    const mappedCleanCvc = mapArabicNumbers(cleanCvc);
    onCvcChange(mappedCleanCvc);
  };

  const getCvcMaxLength = () => {
    const cardNetwork = getCreditCardNetworkFromNumber(cardNumber);

    return cardNetwork === CreditCardNetwork.amex ||
      cardNetwork === CreditCardNetwork.unknown
      ? 4
      : 3;
  };

  return (
    <View style={cardDetailsRowStyles.groupRowBottom}>
      {/* Expiry Date */}
      <View style={cardDetailsRowStyles.groupCol}>
        <TextInput
          style={[
            {
              ...cardDetailsRowStyles.groupInput,
              color: themeColors.text,
            },
            customStyle?.groupedTextInputs,
          ]}
          value={formatExpiryDate(expiry)}
          ref={expiryInputRef}
          returnKeyType="next"
          onSubmitEditing={onExpirySubmit}
          onChangeText={handleExpiryChange}
          placeholder={t('moyasarTranslation:expiryPlaceholder')}
          placeholderTextColor={
            customStyle?.textInputsPlaceholderColor ?? themeColors.placeholder
          }
          keyboardType="numeric"
          editable={!disabled}
          maxLength={9}
          textAlign={isArabicLang() ? 'right' : 'left'}
          accessibilityLabel={t('moyasarTranslation:expiryPlaceholder')}
          testID="moyasar-expiry-input"
        />
      </View>

      {/* Vertical Divider */}
      <View
        style={[
          {
            ...cardDetailsRowStyles.dividerVertical,
            ...getDividerStyle(hasError, themeColors),
          },
          customStyle?.groupedTextInputsDividers,
        ]}
      />

      {/* CVC */}
      <View style={cardDetailsRowStyles.groupCol}>
        <TextInput
          style={[
            {
              ...cardDetailsRowStyles.groupInput,
              color: themeColors.text,
            },
            customStyle?.groupedTextInputs,
          ]}
          value={cvc}
          ref={cvcInputRef}
          returnKeyType="done"
          onSubmitEditing={onCvcSubmit}
          onChangeText={handleCvcChange}
          placeholder={t('moyasarTranslation:cvcPlaceholder')}
          placeholderTextColor={
            customStyle?.textInputsPlaceholderColor ?? themeColors.placeholder
          }
          keyboardType="numeric"
          maxLength={getCvcMaxLength()}
          editable={!disabled}
          textAlign={isArabicLang() ? 'right' : 'left'}
          accessibilityLabel={t('moyasarTranslation:cvcPlaceholder')}
          testID="moyasar-cvc-input"
        />
      </View>
    </View>
  );
};
