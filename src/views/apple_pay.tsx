// @ts-ignore
import { ApplePayButton, PaymentRequest } from '../react_native_apple_pay';
import { debugLog, errorLog } from '../helpers/debug_log';
import { Platform, useColorScheme, View } from 'react-native';
import type { MoyasarProps } from '../models/moyasar_props';
import { currencyToCountryCodeMap, toMajor } from '../helpers/currency_util';
import { assert } from '../helpers/assert';
import { ApplePayPaymentRequestSource } from '../models/sources/apple_pay/apple_pay_request_source';
import type { PaymentConfig } from '../models/payment_config';
import { PaymentRequest as MoyasarPaymentRequest } from '../models/payment_request';
import { createPayment } from '../services/payment_service';

async function onApplePayResponse(
  token: any,
  paymentConfig: PaymentConfig,
  onPaymentResult: (paymentResponse: any) => void
) {
  const source = new ApplePayPaymentRequestSource({
    applePayToken: token,
    manualPayment: paymentConfig.applePay?.manual,
  });

  const paymentRequest = new MoyasarPaymentRequest({
    config: paymentConfig,
    source,
    callbackUrl: 'https://sdk.moyasar.com/return',
  });

  debugLog('Moyasar SDK: Paying with Apple Pay...');

  try {
    const paymentResponse = await createPayment(
      paymentRequest,
      paymentConfig.publishableApiKey
    );

    onPaymentResult(paymentResponse);
  } catch (error) {
    errorLog(`Moyasar SDK: Failed to pay with Apple Pay, ${error}`);
    onPaymentResult(error);
  }
}

export function ApplePay({ paymentConfig, onPaymentResult }: MoyasarProps) {
  const isLightTheme = useColorScheme() === 'light';

  if (Platform.OS !== 'ios') {
    return <View />;
  }

  assert(paymentConfig.applePay !== undefined, 'Apple Pay config is required');

  return (
    <View style={{ alignItems: 'center' }}>
      <ApplePayButton
        type="inStore"
        height={50}
        width="90%"
        cornerRadius={11}
        style={isLightTheme ? 'black' : 'white'}
        onPress={() => {
          debugLog('Moyasar SDK: Apple Pay button pressed');

          const methodData = {
            supportedMethods: ['apple-pay'],
            data: {
              merchantIdentifier: paymentConfig.applePay!.merchantId,
              supportedNetworks: paymentConfig.supportedNetworks,
              countryCode:
                currencyToCountryCodeMap[paymentConfig.currency] || 'SA',
              currencyCode: paymentConfig.currency,
            },
          };

          const details = {
            total: {
              label: paymentConfig.applePay!.label,
              amount: {
                currency: paymentConfig.currency,
                value: toMajor(paymentConfig.amount, paymentConfig.currency),
              },
            },
          };

          const applePayPaymentRequest = new PaymentRequest(
            [methodData],
            details
          );

          debugLog(
            `Moyasar SDK: Apple Pay request: ${JSON.stringify(applePayPaymentRequest)}`
          );

          applePayPaymentRequest
            .show()
            .then(async (paymentResponse: any) => {
              debugLog('Moyasar SDK: Got Apple Pay response');

              if (paymentResponse.details.paymentData) {
                await onApplePayResponse(
                  paymentResponse.details.paymentData,
                  paymentConfig,
                  onPaymentResult
                );
                paymentResponse.complete('success');
              } else {
                errorLog(
                  'Moyasar SDK: Apple Pay token is null, please use a physical device in order to test Apple Pay'
                );
                paymentResponse.complete('failure');
                onPaymentResult(Error('Apple Pay token is null'));
              }
            })
            .catch((error: any) => {
              errorLog(`Moyasar SDK: Apple Pay payment error: ${error}`);
            });
        }}
      />
    </View>
  );
}
