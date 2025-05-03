// @ts-ignore
import { ApplePayButton, PaymentRequest } from '../react_native_apple_pay';
import { debugLog, errorLog } from '../helpers/debug_log';
import { Platform, useColorScheme, View } from 'react-native';
import type { ApplePayProps } from '../models/component_models/moyasar_props';
import { toMajor } from '../helpers/currency_util';
import { assert } from '../helpers/assert';
import { ApplePayRequestSource } from '../models/api/sources/apple_pay/apple_pay_request_source';
import type { PaymentConfig } from '../models/payment_config';
import { PaymentRequest as MoyasarPaymentRequest } from '../models/api/api_requests/payment_request';
import { createPayment } from '../services/payment_service';
import {
  isMoyasarError,
  GeneralError,
  NetworkError,
} from '../models/errors/moyasar_errors';
import type { ResultCallback } from '../models/payment_result';

// TODO: Move to service module
export async function onApplePayResponse(
  token: any,
  paymentConfig: PaymentConfig,
  onPaymentResult: ResultCallback
) {
  const source = new ApplePayRequestSource({
    applePayToken: token,
    manualPayment: paymentConfig.applePay?.manual,
  });

  const paymentRequest = new MoyasarPaymentRequest({
    amount: paymentConfig.amount,
    currency: paymentConfig.currency,
    description: paymentConfig.description,
    metadata: paymentConfig.metadata,
    source: source,
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

export function ApplePay({
  paymentConfig,
  onPaymentResult,
  style,
}: ApplePayProps) {
  assert(
    !!paymentConfig.applePay,
    'Apple Pay config is required to use Apple Pay, you have to configure the `applePay` property in the `PaymentConfig` object'
  );

  const isLightTheme = useColorScheme() === 'light';

  if (Platform.OS !== 'ios' || !paymentConfig.applePay) {
    debugLog(
      'Moyasar SDK: Apple Pay is not supported on this device or the `applePay` property is not set, showing empty view'
    );

    return <View />;
  }

  assert(paymentConfig.applePay !== undefined, 'Apple Pay config is required');

  return (
    <View style={{ alignItems: 'center' }}>
      <ApplePayButton
        type={style?.buttonType ?? 'inStore'}
        height={style?.height ?? 50}
        width={style?.width ?? '90%'}
        cornerRadius={style?.cornerRadius ?? 11}
        style={style?.buttonStyle ?? (isLightTheme ? 'black' : 'white')}
        onPress={() => {
          debugLog('Moyasar SDK: Apple Pay button pressed');

          const methodData = {
            supportedMethods: ['apple-pay'],
            // TODO: Test what happens if the merchantId was not set
            data: {
              merchantIdentifier: paymentConfig.applePay?.merchantId,
              supportedNetworks: paymentConfig.supportedNetworks,
              countryCode: paymentConfig.merchantCountryCode,
              currencyCode: paymentConfig.currency,
            },
          };

          const details = {
            total: {
              label: paymentConfig.applePay?.label,
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

                // TODO: Better handle completion based on `onApplePayResponse` response
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
              // TODO: Should we call the `onPaymentResult` callback here?
              errorLog(`Moyasar SDK: Apple Pay payment error: ${error}`);
            });
        }}
      />
    </View>
  );
}
