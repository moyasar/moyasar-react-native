import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { getConfiguredLocalizations } from '../../../localizations/i18n';
import { formatAmount, toMajor } from '../../../helpers/currency_util';
import { SaudiRiyal } from '../../../assets/saudi_riyal';
import { useTheme } from '../theme_context';
import { paymentButtonStyles } from './payment_button.styles';
import type { PaymentButtonProps } from '../types';

let formattedAmount: string | null;

function getFormattedAmount(amount: number, currency: string): string {
  if (!formattedAmount) {
    return (formattedAmount = formatAmount(amount, currency));
  }
  return formattedAmount;
}

// Export function to reset formatted amount cache
export const resetFormattedAmount = () => {
  formattedAmount = null;
};

export const PaymentButton = ({
  disabled,
  loading,
  amount,
  currency,
  onPress,
}: PaymentButtonProps) => {
  const { t } = getConfiguredLocalizations();
  const { themeColors, customStyle } = useTheme();

  return (
    <TouchableOpacity
      style={[
        {
          ...paymentButtonStyles.button,
          backgroundColor: themeColors.buttonBackground,
        },
        customStyle?.paymentButton,
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled}
      testID="moyasar-pay-button"
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={customStyle?.activityIndicatorColor ?? themeColors.buttonText}
        />
      ) : currency === 'SAR' ? ( // TODO: Remove this temp solution when the new symbol is supported by RN dependencies
        <View
          style={[
            paymentButtonStyles.inputSubContainer,
            { alignItems: 'center' },
            { minHeight: 26 },
          ]}
        >
          <Text
            style={[
              paymentButtonStyles.buttonText,
              { marginEnd: 5 },
              customStyle?.paymentButtonText,
            ]}
          >
            {`${t('moyasarTranslation:pay')}`}
          </Text>
          <View
            style={[
              paymentButtonStyles.inputSubContainer,
              { alignItems: 'center', direction: 'ltr' },
            ]}
          >
            <SaudiRiyal height="16" width="16" />
            <Text
              style={[
                paymentButtonStyles.buttonText,
                { marginStart: 4 },
                customStyle?.paymentButtonText,
              ]}
            >
              {`${toMajor(amount, 'SAR')}`}
            </Text>
          </View>
        </View>
      ) : (
        <Text
          style={[
            paymentButtonStyles.buttonText,
            customStyle?.paymentButtonText,
          ]}
        >
          {t('moyasarTranslation:pay') +
            ' ' +
            getFormattedAmount(amount, currency)}
        </Text>
      )}
    </TouchableOpacity>
  );
};
