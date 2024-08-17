import { StyleSheet, View } from 'react-native';
import {
  ApplePay,
  ApplePayConfig,
  CreditCard,
  PaymentConfig,
  PaymentResponse,
} from 'react-native-moyasar-sdk';

const paymentConfig = new PaymentConfig({
  publishableApiKey: 'pk_test_U38gMHTgVv4wYCd35Zk1JSEd1ZyMYyA9oQ7T4rKa',
  amount: 10000,
  currency: 'SAR',
  description: 'Test payment',
  metadata: { size: '250 g' },
  supportedNetworks: ['mada', 'visa', 'mastercard', 'amex'],
  applePay: new ApplePayConfig({
    merchantId: 'merchant.mysr.aalrabiah',
    label: 'Test Apple Pay from app',
  }),
});

function onPaymentResult(paymentResponse: PaymentResponse) {
  console.log(`Payment done ${JSON.stringify(paymentResponse)}`);
}

function onApplePayResult(paymentResponse: PaymentResponse) {
  console.log(`Apple Pay payment done ${JSON.stringify(paymentResponse)}`);
}

export default function App() {
  return (
    <View style={styles.container}>
      <CreditCard
        paymentConfig={paymentConfig}
        onPaymentResult={onPaymentResult}
      />
      <ApplePay
        paymentConfig={paymentConfig}
        onPaymentResult={onApplePayResult}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
