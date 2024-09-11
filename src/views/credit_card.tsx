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
import { isArabicLang } from '../localizations/i18n';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MoyasarProps } from '../models/moyasar_props';
import { formatAmount } from '../helpers/currency_util';
import { CreditCardPaymentService } from '../services/credit_card_payment_service';
import { WebviewPaymentAuth } from './webview_payment_auth';
import type { CreditCardResponseSource } from '../models/sources/credit_card/credit_card_response_source';
import type { CreditCardProps } from '../models/credit_card_props';
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

const paymentService = new CreditCardPaymentService();

let formattedAmount: string;

function getFormattedAmount(amount: number, currency: string): string {
  if (!formattedAmount) {
    return (formattedAmount = formatAmount(amount, currency));
  }
  return formattedAmount;
}

export function CreditCard({ paymentConfig, onPaymentResult }: MoyasarProps) {
  const [isWebviewVisible, setWebviewVisible] = useState(false);

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
    />
  ) : (
    <CreditCardView
      paymentConfig={paymentConfig}
      onPaymentResult={onPaymentResult}
      setWebviewVisible={setWebviewVisible}
    />
  );
}

// TODO: Extract to a separate file
const CreditCardView = ({
  paymentConfig,
  onPaymentResult,
  setWebviewVisible,
}: CreditCardProps) => {
  const { t } = useTranslation();

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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <View style={styles.inputSubContainer}>
              <TextInput
                style={{
                  ...styles.input,
                  color: useColorScheme() === 'light' ? 'black' : 'white',
                }}
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  setNameError(
                    paymentService.nameValidator.visualValidate(value)
                  );
                }}
                placeholder={t('nameOnCard')}
                autoCorrect={false}
                editable={!isPaymentInProgress}
              />
            </View>

            <Text style={styles.errorText}>{nameError}</Text>

            <View style={styles.inputSubContainer}>
              <TextInput
                style={styles.input}
                value={formatCreditCardNumber(number)}
                onChangeText={(value) => {
                  const cleanNumber = value
                    .replace(/\s/g, '')
                    .replace(/[^0-9]/gi, '');

                  setNumber(cleanNumber);
                  setNumberError(
                    paymentService.numberValidator.visualValidate(cleanNumber)
                  );
                }}
                placeholder={t('cardNumber')}
                keyboardType="numeric"
                editable={!isPaymentInProgress}
                maxLength={
                  getCreditCardNetworkFromNumber(number) ===
                  CreditCardNetwork.amex
                    ? 17
                    : 19
                }
              />
              <View style={styles.cardNetworkLogoContainer}>
                {paymentService.shouldShowNetworkLogo(
                  number,
                  CreditCardNetwork.mada
                ) ? (
                  <Mada style={styles.cardNetworkLogo} />
                ) : null}

                {paymentService.shouldShowNetworkLogo(
                  number,
                  CreditCardNetwork.visa
                ) ? (
                  <Visa style={styles.cardNetworkLogo} />
                ) : null}

                {paymentService.shouldShowNetworkLogo(
                  number,
                  CreditCardNetwork.master
                ) ? (
                  <Mastercard style={styles.cardNetworkLogo} />
                ) : null}

                {paymentService.shouldShowNetworkLogo(
                  number,
                  CreditCardNetwork.amex
                ) ? (
                  <Amex style={styles.cardNetworkLogo} />
                ) : null}
              </View>
            </View>

            <Text style={styles.errorText}>{numberError}</Text>

            <View style={styles.inputSubContainer}>
              <TextInput
                style={styles.input}
                value={formatExpiryDate(expiry)}
                onChangeText={(value) => {
                  const cleanExpiryDate = value
                    .replace(/[\s\/]/g, '')
                    .replace(/[^0-9]/gi, '');

                  setExpiry(cleanExpiryDate);
                  setExpiryError(
                    paymentService.expiryValidator.visualValidate(
                      cleanExpiryDate
                    )
                  );
                }}
                placeholder={t('expiry')}
                keyboardType="numeric"
                editable={!isPaymentInProgress}
                maxLength={9}
              />
            </View>

            <Text style={styles.errorText}>{expiryError}</Text>

            <View style={styles.inputSubContainer}>
              <TextInput
                style={styles.input}
                value={cvc}
                onChangeText={(value) => {
                  setCvc(value);
                  setCvcError(
                    paymentService.cvcValidator.visualValidate(value)
                  );
                }}
                placeholder={t('cvc')}
                keyboardType="numeric"
                maxLength={4}
                editable={!isPaymentInProgress}
              />
            </View>

            <Text style={styles.errorText}>{cvcError}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                isButtonDisabled && {
                  ...styles.button,
                  opacity: 0.5,
                },
              ]}
              onPress={async () => {
                setIsPaymentInProgress(true);
                const showAuthWebview = await paymentService.payByCreditCard(
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
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>
                  {t('pay')}{' '}
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

const styles = StyleSheet.create({
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
