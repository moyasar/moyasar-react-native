import { StyleSheet, View } from 'react-native';
import {
  CreditCard,
  PaymentConfig,
  PaymentResponse,
} from 'react-native-moyasar-sdk';

const paymentConfig = new PaymentConfig({
  publishableApiKey: 'pk_test_U38gMHTgVv4wYCd35Zk1JSEd1ZyMYyA9oQ7T4rKa',
  amount: 10000,
  currency: 'SAR',
  description: 'Test payment',
});

function onPaymentResult(paymentResponse: PaymentResponse) {
  console.log(`Payment done ${JSON.stringify(paymentResponse)}`);
}

export default function App() {
  return (
    <View style={styles.container}>
      <CreditCard
        paymentConfig={paymentConfig}
        onPaymentResult={onPaymentResult}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
