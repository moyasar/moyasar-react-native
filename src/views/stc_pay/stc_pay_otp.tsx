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
import { StcPayService } from '../../services/stc_pay_service';
import { mapArabicNumbers } from '../../helpers/arabic_numbers_mapper';
import type { ResultCallback } from '../../models/payment_result';
import type { StcPayMoyasarStyle } from '../../models/component_models/moyasar_style';

// TODO: Make this component and it's styles reusable with Stc Pay phone number component and CC
export function StcPayOtp({
  onPaymentResult,
  style: customStyle,
  stcPayService,
}: {
  onPaymentResult: ResultCallback;
  style?: StcPayMoyasarStyle;
  stcPayService: StcPayService;
}) {
  useEffect(() => {
    debugLog('Moyasar SDK: stc pay OTP view mounted');
    return () => {
      debugLog('Moyasar SDK: stc pay OTP view unmounted');
    };
  }, []);

  const { t } = getConfiguredLocalizations();
  const isLightMode = useColorScheme() === 'light';

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(
      !!stcPayService.otpValidator.validate(otp) || isPaymentInProgress
    );
    // stcPayService is not a changing prop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, isPaymentInProgress]);

  return (
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
            {t('moyasarTranslation:otpTitle')}
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
              value={otp}
              onChangeText={(value) => {
                const cleanOtp = value
                  .replace(/\s/g, '')
                  .replace(/[^\d٠-٩]/gi, '');

                const mappedCleanOtp = mapArabicNumbers(cleanOtp);

                setOtp(mappedCleanOtp);
                setOtpError(
                  stcPayService.otpValidator.visualValidate(mappedCleanOtp)
                );
              }}
              placeholder={'XXXXXX'}
              keyboardType="numeric"
              editable={!isPaymentInProgress}
              maxLength={10}
            />
          </View>

          <Text style={[defaultStyle.errorText, customStyle?.errorText]}>
            {otpError}
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
                await stcPayService.submitStcPaymentOtp(otp, onPaymentResult);
                setIsPaymentInProgress(false);
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
                  {t('moyasarTranslation:otpConfirm')}
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
    backgroundColor: '#480986',
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
