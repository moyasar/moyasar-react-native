import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import {
  getConfiguredLocalizations,
  isArabicLang,
} from '../localizations/i18n';
import { useEffect, useState } from 'react';
import type { CreditCardProps } from '../models/component_models/moyasar_props';
import { formatAmount, toMajor } from '../helpers/currency_util';
import { CreditCardPaymentService } from '../services/credit_card_payment_service';
import { WebviewPaymentAuth } from './webview_payment_auth';
import type { CreditCardResponseSource } from '../models/api/sources/credit_card/credit_card_response_source';
import { Visa } from '../assets/visa';
import { Mastercard } from '../assets/mastercard';
import { Amex } from '../assets/amex';
import { Mada } from '../assets/mada';
import { CreditCardNetwork } from '../models/credit_card_network';
import {
  formatCreditCardNumber,
  formatExpiryDate,
} from '../helpers/formatters';
import { getCreditCardNetworkFromNumber } from '../helpers/credit_card_utils';
import { mapArabicNumbers } from '../helpers/arabic_numbers_mapper';
import { debugLog } from '../helpers/debug_log';
import { SaudiRiyal } from '../assets/saudi_riyal';

// TODO: Modify to a better approach rather than global variable
const paymentService = new CreditCardPaymentService();

let formattedAmount: string | null;

function getFormattedAmount(amount: number, currency: string): string {
  if (!formattedAmount) {
    return (formattedAmount = formatAmount(amount, currency));
  }
  return formattedAmount;
}

export function CreditCard({
  paymentConfig,
  onPaymentResult,
  style: customStyle,
}: CreditCardProps) {
  const [isWebviewVisible, setWebviewVisible] = useState(false);

  useEffect(() => {
    debugLog('Moyasar SDK: CreditCard view mounted');
    return () => {
      debugLog('Moyasar SDK: CreditCard view unmounted');
      formattedAmount = null;
    };
  }, []);

  return isWebviewVisible ? (
    <WebviewPaymentAuth
      transactionUrl={
        (paymentService.payment?.source as CreditCardResponseSource)
          .transactionUrl
      }
      onWebviewPaymentAuthResult={(webviewPaymentResponse) => {
        if (paymentService.payment) {
          paymentService.payment.status = webviewPaymentResponse.status as any;
          (paymentService.payment.source as CreditCardResponseSource).message =
            webviewPaymentResponse.message;
          onPaymentResult(paymentService.payment);
        }
      }}
      style={customStyle}
    />
  ) : (
    <CreditCardView
      paymentConfig={paymentConfig}
      onPaymentResult={onPaymentResult}
      style={customStyle}
      setWebviewVisible={setWebviewVisible}
    />
  );
}

// TODO: Extract to a separate file
const CreditCardView = ({
  paymentConfig,
  onPaymentResult,
  style: customStyle,
  setWebviewVisible,
}: CreditCardProps & {
  setWebviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = getConfiguredLocalizations();
  const isLightMode = useColorScheme() === 'light';

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const [nameError, setNameError] = useState<string | null>(null);
  const [numberError, setNumberError] = useState<string | null>(null);
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [cvcError, setCvcError] = useState<string | null>(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isPaymentInProgress, setIsPaymentInProgress] =
    useState<boolean>(false);

  useEffect(() => {
    setIsButtonDisabled(
      !paymentService.validateAllFields({ name, number, expiry, cvc }) ||
        isPaymentInProgress
    );
  }, [name, number, expiry, cvc, isPaymentInProgress]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={defaultStyle.scrollView}>
        <View style={[defaultStyle.container, customStyle?.container]}>
          <View style={defaultStyle.inputContainer}>
            <View style={defaultStyle.inputSubContainer}>
              <TextInput
                style={[
                  {
                    ...defaultStyle.input,
                    color: isLightMode ? 'black' : 'white',
                  },
                  customStyle?.textInputs,
                ]}
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  setNameError(
                    paymentService.nameValidator.visualValidate(value)
                  );
                }}
                placeholder={t('moyasarTranslation:nameOnCard')}
                placeholderTextColor={customStyle?.textInputsPlaceholderColor}
                autoCorrect={false}
                editable={!isPaymentInProgress}
              />
            </View>

            <Text style={[defaultStyle.errorText, customStyle?.errorText]}>
              {nameError}
            </Text>

            <View style={defaultStyle.inputSubContainer}>
              <TextInput
                style={[
                  {
                    ...defaultStyle.input,
                    color: isLightMode ? 'black' : 'white',
                  },
                  customStyle?.textInputs,
                ]}
                value={formatCreditCardNumber(number)}
                onChangeText={(value) => {
                  const cleanNumber = value
                    .replace(/\s/g, '')
                    .replace(/[^\d٠-٩]/gi, '')
                    .slice(0, 16);

                  const mappedCleanNumbers = mapArabicNumbers(cleanNumber);

                  setNumber(mappedCleanNumbers);
                  setNumberError(
                    paymentService.numberValidator.visualValidate(
                      mappedCleanNumbers
                    )
                  );
                  // To better handle Amex card validation
                  setCvcError(
                    paymentService.cvcValidator.visualValidate(
                      cvc,
                      mappedCleanNumbers
                    )
                  );
                }}
                placeholder={t('moyasarTranslation:cardNumber')}
                placeholderTextColor={customStyle?.textInputsPlaceholderColor}
                keyboardType="numeric"
                editable={!isPaymentInProgress}
                maxLength={
                  getCreditCardNetworkFromNumber(number) ===
                  CreditCardNetwork.amex
                    ? 17
                    : 19
                }
              />
              <View style={defaultStyle.cardNetworkLogoContainer}>
                {paymentService.shouldShowNetworkLogo(
                  number,
                  CreditCardNetwork.mada
                ) ? (
                  <Mada style={defaultStyle.cardNetworkLogo} />
                ) : null}

                {paymentService.shouldShowNetworkLogo(
                  number,
                  CreditCardNetwork.visa
                ) ? (
                  <Visa style={defaultStyle.cardNetworkLogo} />
                ) : null}

                {paymentService.shouldShowNetworkLogo(
                  number,
                  CreditCardNetwork.master
                ) ? (
                  <Mastercard style={defaultStyle.cardNetworkLogo} />
                ) : null}

                {paymentService.shouldShowNetworkLogo(
                  number,
                  CreditCardNetwork.amex
                ) ? (
                  <Amex style={defaultStyle.cardNetworkLogo} />
                ) : null}
              </View>
            </View>

            <Text style={[defaultStyle.errorText, customStyle?.errorText]}>
              {numberError}
            </Text>

            <View style={defaultStyle.inputSubContainer}>
              <TextInput
                style={[
                  {
                    ...defaultStyle.input,
                    color: isLightMode ? 'black' : 'white',
                  },
                  customStyle?.textInputs,
                ]}
                value={formatExpiryDate(expiry)}
                onChangeText={(value) => {
                  const cleanExpiryDate = value
                    .replace(/[\s\/]/g, '')
                    .replace(/[^\d٠-٩]/gi, '')
                    .slice(0, 6);

                  const mappedCleanExpiryDate =
                    mapArabicNumbers(cleanExpiryDate);

                  setExpiry(mappedCleanExpiryDate);
                  setExpiryError(
                    paymentService.expiryValidator.visualValidate(
                      mappedCleanExpiryDate
                    )
                  );
                }}
                placeholder={t('moyasarTranslation:expiry')}
                placeholderTextColor={customStyle?.textInputsPlaceholderColor}
                keyboardType="numeric"
                editable={!isPaymentInProgress}
                maxLength={9}
              />
            </View>

            <Text style={[defaultStyle.errorText, customStyle?.errorText]}>
              {expiryError}
            </Text>

            <View style={defaultStyle.inputSubContainer}>
              <TextInput
                style={[
                  {
                    ...defaultStyle.input,
                    color: isLightMode ? 'black' : 'white',
                  },
                  customStyle?.textInputs,
                ]}
                value={cvc}
                onChangeText={(value) => {
                  const cleanCvc = value
                    .replace(/\s/g, '')
                    .replace(/[^\d٠-٩]/gi, '');

                  const mappedCleanCvc = mapArabicNumbers(cleanCvc);

                  setCvc(mappedCleanCvc);
                  setCvcError(
                    paymentService.cvcValidator.visualValidate(
                      mappedCleanCvc,
                      number
                    )
                  );
                }}
                placeholder={t('moyasarTranslation:cvc')}
                placeholderTextColor={customStyle?.textInputsPlaceholderColor}
                keyboardType="numeric"
                maxLength={(() => {
                  const cardNetwork = getCreditCardNetworkFromNumber(number);

                  return cardNetwork === CreditCardNetwork.amex ||
                    cardNetwork === CreditCardNetwork.unknown
                    ? 4
                    : 3;
                })()}
                editable={!isPaymentInProgress}
              />
            </View>

            <Text style={[defaultStyle.errorText, customStyle?.errorText]}>
              {cvcError}
            </Text>
          </View>

          <View style={defaultStyle.buttonContainer}>
            <TouchableOpacity
              style={[
                defaultStyle.button,
                customStyle?.paymentButton,
                isButtonDisabled && {
                  opacity: 0.5,
                },
              ]}
              onPress={async () => {
                setIsPaymentInProgress(true);
                const showAuthWebview = await paymentService.beginTransaction(
                  paymentConfig,
                  { name, number, expiry, cvc },
                  onPaymentResult
                );
                setIsPaymentInProgress(false);

                setWebviewVisible(showAuthWebview);
              }}
              disabled={isButtonDisabled}
            >
              {isPaymentInProgress ? (
                <ActivityIndicator
                  size="small"
                  color={customStyle?.activityIndicatorColor ?? '#ffffff'}
                />
              ) : paymentConfig.currency === 'SAR' ? ( // TODO: Remove this temp solution when the new symbol is supported by RN dependencies
                <View
                  style={[
                    defaultStyle.inputSubContainer,
                    { alignItems: 'center' },
                  ]}
                >
                  <Text
                    style={[
                      defaultStyle.buttonText,
                      { marginEnd: 5 },
                      customStyle?.paymentButtonText,
                    ]}
                  >
                    {`${t('moyasarTranslation:pay')}`}
                  </Text>
                  <View
                    style={[
                      defaultStyle.inputSubContainer,
                      { alignItems: 'center', direction: 'ltr' },
                    ]}
                  >
                    <SaudiRiyal
                      height="16"
                      width="16"
                      style={customStyle?.paymentButtonText}
                    />
                    <Text
                      style={[
                        defaultStyle.buttonText,
                        { marginStart: 4 },
                        customStyle?.paymentButtonText,
                      ]}
                    >
                      {`${toMajor(paymentConfig.amount, 'SAR')}`}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text
                  style={[
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
};

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
  inputContainer: {
    justifyContent: 'flex-start',
  },
  inputSubContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    direction: isArabicLang() ? 'rtl' : 'ltr',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
    backgroundColor: '#235CE1',
    borderRadius: 9,
    marginTop: 30,
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
  cardNetworkLogoContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    end: 10,
    justifyContent: 'flex-end',
  },
  cardNetworkLogo: {
    marginEnd: 8,
    height: 37,
    width: 37,
  },
});
