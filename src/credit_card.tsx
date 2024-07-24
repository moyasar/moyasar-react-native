import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import './localizations/i18n';
import CreditCardRequestSource from './models/sources/credit_card/credit_card_request_source';
import PaymentRequest from './models/payment_request';
import { debugLog } from './helpers/debug_log';
import { createPayment } from './services/payment_service';
import { PaymentConfig } from './models/payment_config';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MoyasarProps } from './models/moyasar_props';
import type { PaymentResponse } from './models/payment_response';

// TODO: Remove temp code used for testing only
const creditCardRequestSource: CreditCardRequestSource =
  new CreditCardRequestSource({
    name: 'a a',
    number: '4111111111111111',
    cvc: '123',
    month: '12',
    year: '2025',
    tokenizeCard: false,
    manualPayment: false,
  });
//

async function pay(
  paymentConfig: PaymentConfig,
  onPaymentResult: (onPaymentResult: PaymentResponse) => void
) {
  debugLog('Moyasar SDK: Paying...');

  const paymentRequest = new PaymentRequest(
    paymentConfig,
    creditCardRequestSource
  );

  const payment = await createPayment(
    paymentRequest,
    paymentConfig.publishableApiKey
  );

  onPaymentResult(payment);

  debugLog(
    `Moyasar SDK: Payment done, ${JSON.stringify(payment)} \n status: ${payment.status}`
  );
}

export function CreditCard({ paymentConfig, onPaymentResult }: MoyasarProps) {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

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
                value={name}
                onChangeText={setName}
                placeholder={t('nameOnCard')}
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputSubContainer}>
              <TextInput
                style={styles.input}
                value={number}
                onChangeText={setNumber}
                placeholder={t('cardNumber')}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputSubContainer}>
              <TextInput
                style={styles.input}
                value={expiry}
                onChangeText={setExpiry}
                placeholder={t('expiry')}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputSubContainer}>
              <TextInput
                style={styles.input}
                value={cvc}
                onChangeText={setCvc}
                placeholder={t('cvc')}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>

          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => pay(paymentConfig, onPaymentResult)}
            >
              <View style={styles.buttonView}>
                <Text style={styles.buttonText}>{t('pay')}</Text>
              </View>
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
  input: {
    width: '100%',
    fontSize: 18,
    borderWidth: 1.25,
    borderColor: '#DCDCDC',
    borderRadius: 7,
    margin: 12,
    padding: 10,
  },
  buttonView: {
    minWidth: '100%',
    alignSelf: 'center',
    backgroundColor: '#235CE1',
    borderRadius: 9,
    marginTop: 30,
    padding: 10,
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'semibold',
    textAlign: 'center',
  },
});
