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
} from 'react-native';
import { currentLang, isArabicLang } from '../localizations/i18n';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MoyasarProps } from '../models/moyasar_props';
import { toMajor } from '../helpers/currency_util';
import type { CreditCardFields } from '../models/component_models/credit_card_fields';
import type { CreditCardErrorFields } from '../models/component_models/credit_card_error_fields';
import { CreditCardPaymentService } from '../services/credit_card_payment_service';

const paymentService = new CreditCardPaymentService();

let formattedAmount: string;

function getFormattedAmount(amount: number, currency: string): string {
  if (!formattedAmount) {
    const numberFormatter = new Intl.NumberFormat(currentLang, {
      style: 'currency',
      currency: currency,
      useGrouping: true,
    });
    let majorAmount = toMajor(amount, currency);
    return (formattedAmount = numberFormatter.format(majorAmount));
  }
  return formattedAmount;
}

export function CreditCard({ paymentConfig, onPaymentResult }: MoyasarProps) {
  const { t } = useTranslation();

  const [fields, setFields] = useState<CreditCardFields>({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });
  const [errors, setError] = useState<CreditCardErrorFields>({
    name: null,
    number: null,
    expiry: null,
    cvc: null,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isPaymentInProgress, setIsPaymentInProgress] =
    useState<boolean>(false);

  useEffect(() => {
    setIsButtonDisabled(
      !paymentService.validateAllFields(fields) || isPaymentInProgress
    );
  }, [fields, isPaymentInProgress]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <View style={styles.inputSubContainer}>
              <TextInput
                style={styles.input}
                value={fields.name}
                onChangeText={(value) => {
                  setFields({ ...fields, name: value });
                  setError({
                    ...errors,
                    name: paymentService.nameValidator.visualValidate(value),
                  });
                }}
                placeholder={t('nameOnCard')}
                autoCorrect={false}
                editable={!isPaymentInProgress}
              />
            </View>

            <Text style={styles.errorText}>{errors.name}</Text>

            <View style={styles.inputSubContainer}>
              <TextInput
                style={styles.input}
                value={fields.number}
                onChangeText={(value) => {
                  setFields({ ...fields, number: value });
                  setError({
                    ...errors,
                    number:
                      paymentService.numberValidator.visualValidate(value),
                  });
                }}
                placeholder={t('cardNumber')}
                keyboardType="numeric"
                editable={!isPaymentInProgress}
              />
            </View>

            <Text style={styles.errorText}>{errors.number}</Text>

            <View style={styles.inputSubContainer}>
              <TextInput
                style={styles.input}
                value={fields.expiry}
                onChangeText={(value) => {
                  setFields({ ...fields, expiry: value });
                  setError({
                    ...errors,
                    expiry:
                      paymentService.expiryValidator.visualValidate(value),
                  });
                }}
                placeholder={t('expiry')}
                keyboardType="numeric"
                editable={!isPaymentInProgress}
              />
            </View>

            <Text style={styles.errorText}>{errors.expiry}</Text>

            <View style={styles.inputSubContainer}>
              <TextInput
                style={styles.input}
                value={fields.cvc}
                onChangeText={(value) => {
                  setFields({ ...fields, cvc: value });
                  setError({
                    ...errors,
                    cvc: paymentService.cvcValidator.visualValidate(value),
                  });
                }}
                placeholder={t('cvc')}
                keyboardType="numeric"
                maxLength={4}
                editable={!isPaymentInProgress}
              />
            </View>
          </View>

          <Text style={styles.errorText}>{errors.cvc}</Text>

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
                await paymentService.payByCreditCard(
                  paymentConfig,
                  fields,
                  onPaymentResult
                );
                setIsPaymentInProgress(false);
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
}

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
    textAlign: isArabicLang() ? 'left' : 'right',
  },
});
