// @ts-ignore
import { ApplePayButton, PaymentRequest } from '../react_native_apple_pay';
import { debugLog, errorLog } from '../helpers/debug_log';
import { Platform, useColorScheme, View } from 'react-native';
import type { MoyasarProps } from '../models/moyasar_props';
import { currencyToCountryCodeMap, toMajor } from '../helpers/currency_util';
import { assert } from '../helpers/assert';
import { ApplePayPaymentRequestSource } from '../models/api/sources/apple_pay/apple_pay_request_source';
import type { PaymentConfig } from '../models/payment_config';
import { PaymentRequest as MoyasarPaymentRequest } from '../models/api/api_requests/payment_request';
import { createPayment } from '../services/payment_service';
import {
  isMoyasarError,
  GeneralError,
  NetworkError,
} from '../models/errors/moyasar_errors';
import type { ResultCallback } from '../models/payment_result';

async function onApplePayResponse(
  token: any,
  paymentConfig: PaymentConfig,
  onPaymentResult: ResultCallback
) {
  const source = new ApplePayPaymentRequestSource({
    applePayToken: token,
    manualPayment: paymentConfig.applePay?.manual,
  });

  const paymentRequest = new MoyasarPaymentRequest({
    amount: paymentConfig.amount,
    currency: paymentConfig.currency,
    description: paymentConfig.description,
    metadata: paymentConfig.metadata,
    source: source,
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

    if (isMoyasarError(error)) {
      onPaymentResult(error);
    } else {
      onPaymentResult(
        new NetworkError(
          'Moyasar SDK: An error occured error while processing an Apple Pay payment'
        )
      );
    }
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
                onPaymentResult(
                  new GeneralError(
                    'Moyasar SDK: Apple Pay token is null, are you using a Simulator? Please file a bug report if you are not'
                  )
                );
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
