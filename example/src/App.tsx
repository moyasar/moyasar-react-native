import { StyleSheet, View } from 'react-native';
import {
  ApplePay,
  ApplePayConfig,
  CreditCard,
  CreditCardConfig,
  GeneralError,
  NetworkEndpointError,
  NetworkError,
  PaymentConfig,
  PaymentResponse,
  PaymentStatus,
  type MoyasarError,
} from 'react-native-moyasar-sdk';

const paymentConfig = new PaymentConfig({
  publishableApiKey: 'pk_test_U38gMHTgVv4wYCd35Zk1JSEd1ZyMYyA9oQ7T4rKa',
  amount: 10000,
  currency: 'SAR',
  description: 'Test payment',
  metadata: { size: '250 g' },
  supportedNetworks: ['mada', 'visa', 'mastercard', 'amex'],
  creditCard: new CreditCardConfig({ saveCard: true, manual: false }),
  applePay: new ApplePayConfig({
    merchantId: 'merchant.mysr.aalrabiah',
    label: 'Test Apple Pay from app',
    manual: false,
  }),
});

function onPaymentResult(paymentResponse: PaymentResponse | MoyasarError) {
  if (paymentResponse instanceof PaymentResponse) {
    switch (paymentResponse.status) {
      case PaymentStatus.paid:
        // handle success
        console.log(`Payment succeeded ${JSON.stringify(paymentResponse)}`);
        break;
      case PaymentStatus.failed:
        // handle failure
        console.log(`Payment failed ${JSON.stringify(paymentResponse)}`);
        break;
      default:
        // handle other statuses
        console.log(`Payment: ${JSON.stringify(paymentResponse)}`);
    }
  } else {
    // handle errors
    console.log('Payment callback called with error');

    if (paymentResponse instanceof NetworkEndpointError) {
      console.log(
        `Backend endpoint error message: ${paymentResponse.error.message}, errors: ${JSON.stringify(paymentResponse.error.errors)}, error type: ${paymentResponse.error.type}`
      );
    } else if (paymentResponse instanceof NetworkError) {
      console.log(`Error message: ${paymentResponse.message}`);
    } else if (paymentResponse instanceof GeneralError) {
      console.log(`Error message: ${paymentResponse.message}`);
    }
  }
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
        onPaymentResult={onPaymentResult}
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
