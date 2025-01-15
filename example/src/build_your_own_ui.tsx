// Below is a simple form of the needed logic and configuration to get started with building your own UI

import {
  ApplePayRequestSource,
  createPayment,
  createToken,
  CreditCardRequestSource,
  CreditCardResponseSource,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  sendOtp,
  StcPayRequestSource,
  StcPayResponseSource,
  TokenRequest,
} from 'react-native-moyasar-sdk';

const apiKey = 'YOUR_PUBLISHABLE_API_KEY';

// Credit Card payment

const ccSource = new CreditCardRequestSource({
  name: 'John Doe',
  number: '4111111111111111',
  cvc: '123',
  month: '12',
  year: '28',
  tokenizeCard: false,
  manualPayment: false,
});

const ccPaymentRequest = new PaymentRequest({
  amount: 1000,
  currency: 'SAR',
  description: 'Test payment',
  metadata: { size: '250 g' },
  source: ccSource,
  callbackUrl: 'https://example.com/callback', // Replace with the URL to be redirected to after a 3D secure transaction
});

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function payUsingCreditCard() {
  const paymentResponse = await createPayment(ccPaymentRequest, apiKey);

  if (paymentResponse instanceof PaymentResponse) {
    if (paymentResponse.status != PaymentStatus.initiated) {
      // Handle cases where payment status could be paid, failed, authorized, etc...
      return;
    }

    // Start the 3D secure webview process
    startCcPaymentAuthProcess(paymentResponse);
  } else {
    // Handle MoyasarError
  }

  console.log(`Credit Card payment result: ${JSON.stringify(paymentResponse)}`);
}

async function startCcPaymentAuthProcess(paymentResponse: PaymentResponse) {
  if (paymentResponse.source instanceof CreditCardResponseSource) {
    // Show the 3D secure webview using the URL in `paymentResponse.source.transactionUrl`
  } else {
    // Handle unexpected Credit Card payment error
  }
}

// Apple Pay payment

const applePaySource = new ApplePayRequestSource({
  applePayToken: 'APPLE_PAY_PAYMENT_TOKEN', // Replace with actual Apple Pay payment token from Apple Pay APIs
});

const applePayPaymentRequest = new PaymentRequest({
  amount: 1000,
  currency: 'SAR',
  description: 'Test payment',
  metadata: { size: '250 g' },
  source: applePaySource,
});

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function payByApplePay() {
  const paymentResponse = await createPayment(applePayPaymentRequest, apiKey);

  console.log(`Apple Pay payment result: ${JSON.stringify(paymentResponse)}`);
}

// Stc Pay payment

const stcPaySource = new StcPayRequestSource({
  mobile: '0512345678',
});

const stcPayPaymentRequest = new PaymentRequest({
  amount: 1000,
  currency: 'SAR',
  description: 'Test payment',
  metadata: { size: '250 g' },
  source: stcPaySource,
});

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function payUsingStcPay() {
  const paymentResponse = await createPayment(stcPayPaymentRequest, apiKey);

  if (paymentResponse instanceof PaymentResponse) {
    if (paymentResponse.status != PaymentStatus.initiated) {
      // Handle cases where payment status could be paid, failed, authorized, etc...
      return;
    }

    if (!(paymentResponse.source instanceof StcPayResponseSource)) {
      // Handle unexpected STC Pay payment error
      return;
    }

    // After the user enters the OTP, send it to Moyasar using the `sendOtp` function
    await sendOtp('123456', paymentResponse.source.transactionUrl);
    // Handle result
  } else {
    // Handle MoyasarError
  }

  console.log(`Stc Pay payment result: ${JSON.stringify(paymentResponse)}`);
}

// Credit Card token

const tokenRequest = new TokenRequest({
  name: 'John Doe',
  number: '4111111111111111',
  cvc: '123',
  month: '12',
  year: '28',
  saveOnly: true,
  callbackUrl: 'https://example.com/callback', // Replace with the URL to be redirected to after a 3D secure transaction
});

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function createCcToken() {
  const tokenResponse = await createToken(tokenRequest, apiKey);

  console.log(
    `Create Credit Card token result: ${JSON.stringify(tokenResponse)}`
  );
}
