import { ScrollView, StyleSheet, View } from 'react-native';
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
  StcPay,
  TokenResponse,
  type PaymentResult,
} from 'react-native-moyasar-sdk';

const paymentConfig = new PaymentConfig({
  publishableApiKey: 'pk_test_U38gMHTgVv4wYCd35Zk1JSEd1ZyMYyA9oQ7T4rKa',
  amount: 10001,
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
  createSaveOnlyToken: false,
});

function onPaymentResult(paymentResult: PaymentResult) {
  if (paymentResult instanceof PaymentResponse) {
    switch (paymentResult.status) {
      case PaymentStatus.paid:
        // handle success
        console.log(`Payment succeeded ${JSON.stringify(paymentResult)}`);
        break;
      case PaymentStatus.failed:
        // handle failure
        console.log(`Payment failed ${JSON.stringify(paymentResult)}`);
        break;
      default:
        // handle other statuses
        console.log(`Payment: ${JSON.stringify(paymentResult)}`);
    }
  } else if (paymentResult instanceof TokenResponse) {
    // Not needed if not utilizing 'createSaveOnlyToken' flow
    // handle token response
    console.log(`Token response: ${JSON.stringify(paymentResult)}`);
  } else {
    // handle errors
    console.log('Payment callback called with error');

    if (paymentResult instanceof NetworkEndpointError) {
      console.log(
        `Backend endpoint error message: ${paymentResult.error.message}, errors: ${JSON.stringify(paymentResult.error.errors)}, error type: ${paymentResult.error.type}`
      );
    } else if (paymentResult instanceof NetworkError) {
      console.log(`Network error message: ${paymentResult.message}`);
    } else if (paymentResult instanceof GeneralError) {
      console.log(`General error message: ${paymentResult.message}`);
    }
  }
}

export default function App() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <StcPay
          paymentConfig={paymentConfig}
          onPaymentResult={onPaymentResult}
          style={{ textInput: { borderWidth: 1.25 } }}
        />
        <CreditCard
          paymentConfig={paymentConfig}
          onPaymentResult={onPaymentResult}
          style={{ textInputs: { borderWidth: 1.25 } }}
        />
        <ApplePay
          paymentConfig={paymentConfig}
          onPaymentResult={onPaymentResult}
          style={{
            buttonType: 'buy',
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
