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
  SamsungPay,
  SamsungPayConfig,
  TokenResponse,
  type PaymentResult,
  UnexpectedError,
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  PaymentSplit,
} from 'react-native-moyasar-sdk';

const paymentConfig = new PaymentConfig({
  // givenId: '013d92f2-c67b-49c6-ae03-d7c548c771a2',
  publishableApiKey: 'pk_test_U38gMHTgVv4wYCd35Zk1JSEd1ZyMYyA9oQ7T4rKa',
  // baseUrl: 'https://apimig.moyasar.com', // Staging base URL
  amount: 20001,
  currency: 'SAR',
  merchantCountryCode: 'SA',
  description: 'Test payment',
  metadata: { size: '250 g' },
  supportedNetworks: ['mada', 'visa', 'mastercard', 'amex'],
  creditCard: new CreditCardConfig({ saveCard: false, manual: false }),
  applePay: new ApplePayConfig({
    merchantId: 'merchant.mysr.aalrabiah',
    label: 'Test Apple Pay from app',
    manual: false,
    saveCard: false,
  }),
  createSaveOnlyToken: false,
  samsungPay: new SamsungPayConfig({
    serviceId: 'ea810dafb758408fa530b1',
    merchantName: 'Test Samsung Pay from app',
    orderNumber: 'c553ed70-fb79-487c-b3d2-15aca6aff90c',
    manual: false,
  }),
  applyCoupon: true,
  // splits: [ publishableApiKey for testing: 'pk_test_uQra5pwtUo9GaenMSS4XgfAmeLhmjUTJwFdXJxsH'
  //   new PaymentSplit({
  //     recipientId: '7d2d0797-a2be-40fe-bb1b-1fdec9824c95',
  //     amount: 10001,
  //   }),
  //   new PaymentSplit({
  //     recipientId: '327680bb-d790-4643-8e10-31455a1ab3a6',
  //     amount: 10000,
  //     reference: 'optional-reference-for-split-1fcfcbe9-ba75-4eed',
  //     description: 'Platform processing fee',
  //     feeSource: true,
  //     refundable: true,
  //   }),
  // ],
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
    } else if (paymentResult instanceof UnexpectedError) {
      console.log(`Unexpected error message: ${paymentResult.message}`);
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
          style={{ textInputs: { borderWidth: 1.25 } }}
        />
        <SamsungPay
          paymentConfig={paymentConfig}
          onPaymentResult={onPaymentResult}
          style={{ width: '90%' }}
        />
        <CreditCard
          paymentConfig={paymentConfig}
          onPaymentResult={onPaymentResult}
          style={{ textInputs: { borderWidth: 1.25 } }}
        />
        <ApplePay
          paymentConfig={paymentConfig}
          onPaymentResult={onPaymentResult}
          style={{ buttonType: 'buy' }}
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
