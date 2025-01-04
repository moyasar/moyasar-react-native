import { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { debugLog } from '../../helpers/debug_log';
import {
  isArabicLang,
  getConfiguredLocalizations,
} from '../../localizations/i18n';
import type { StcPayProps } from '../../models/component_models/moyasar_props';
import { StcPayService } from '../../services/stc_pay_service';
import { formatAmount } from '../../helpers/currency_util';
import { mapArabicNumbers } from '../../helpers/arabic_numbers_mapper';
import { formatMobileNumber } from '../../helpers/formatters';

const stcPayService = new StcPayService();

let formattedAmount: string | null;
// TODO: Move this to a helper function to be reusable with CC
function getFormattedAmount(amount: number, currency: string): string {
  if (!formattedAmount) {
    return (formattedAmount = formatAmount(amount, currency));
  }
  return formattedAmount;
}

export function StcPay({
  paymentConfig,
  onPaymentResult,
  style: customStyle,
}: StcPayProps) {
  useEffect(() => {
    debugLog('Moyasar SDK: stc pay view mounted');
    return () => {
      debugLog('Moyasar SDK: stc pay view unmounted');
    };
  }, []);

  const { t } = getConfiguredLocalizations();
  const isLightMode = useColorScheme() === 'light';

  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState<string | null>(
    null
  );

  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(
      !!stcPayService.phoneNumberValidator.validate(mobileNumber) ||
        isPaymentInProgress
    );
  }, [mobileNumber, isPaymentInProgress]);

  return isOtpVisible ? null : (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={defaultStyle.scrollView}>
        <View style={[defaultStyle.container, customStyle?.container]}>
          <Text
            style={[
              { ...defaultStyle.title, color: isLightMode ? 'black' : 'white' },
              customStyle?.title,
            ]}
          >
            {t('moyasarTranslation:phoneNumberTitle')}
          </Text>
          <View style={defaultStyle.inputSubContainer}>
            <TextInput
              style={[
                {
                  ...defaultStyle.input,
                  color: isLightMode ? 'black' : 'white',
                },
                customStyle?.textInput,
              ]}
              value={formatMobileNumber({ cleanedNumber: mobileNumber })}
              onChangeText={(value) => {
                const cleanNumber = value
                  .replace(/\s/g, '')
                  .replace(/[^\d٠-٩]/gi, '');

                const mappedCleanNumbers = mapArabicNumbers(cleanNumber);

                setMobileNumber(mappedCleanNumbers);
                setMobileNumberError(
                  stcPayService.phoneNumberValidator.visualValidate(
                    mappedCleanNumbers
                  )
                );
              }}
              placeholder={'05X XXX XXXX'}
              keyboardType="numeric"
              editable={!isPaymentInProgress}
              maxLength={12}
            />
          </View>

          <Text style={[defaultStyle.errorText, customStyle?.errorText]}>
            {mobileNumberError}
          </Text>

          <View style={defaultStyle.buttonContainer}>
            <TouchableOpacity
              style={[
                defaultStyle.button,
                customStyle?.paymentButton,
                isButtonDisabled && { opacity: 0.5 },
              ]}
              onPress={async () => {
                setIsPaymentInProgress(true);
                const showOtp = await stcPayService.beginStcPayment(
                  paymentConfig,
                  mobileNumber,
                  onPaymentResult
                );
                setIsPaymentInProgress(false);

                setIsOtpVisible(showOtp);
              }}
              disabled={isButtonDisabled}
            >
              {isPaymentInProgress ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text
                  style={[
                    // TODO: Make this component reusable with CC
                    defaultStyle.buttonText,
                    customStyle?.paymentButtonText,
                  ]}
                >
                  {t('moyasarTranslation:pay')}{' '}
                  {getFormattedAmount(
                    paymentConfig.amount,
                    paymentConfig.currency
                  )}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const defaultStyle = StyleSheet.create({
  scrollView: {
    maxWidth: '100%',
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    padding: 25,
  },
  title: {
    fontSize: 18,
    marginStart: 4,
    marginTop: 4,
    textAlign: 'left',
    direction: isArabicLang() ? 'rtl' : 'ltr',
  },
  inputSubContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    direction: isArabicLang() ? 'rtl' : 'ltr',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  input: {
    width: '100%',
    fontSize: 18,
    textAlign: isArabicLang() ? 'right' : 'left',
    borderWidth: 1.25,
    borderColor: '#DCDCDC',
    borderRadius: 7,
    margin: 8,
    padding: 10,
  },
  button: {
    minWidth: '100%',
    justifyContent: 'center',
    backgroundColor: 'purple', // TODO: Modify to stc pay button color
    borderRadius: 9,
    padding: 10,
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'left',
    direction: isArabicLang() ? 'rtl' : 'ltr',
  },
});
