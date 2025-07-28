import {
  View,
  Platform,
  findNodeHandle,
  UIManager,
  NativeModules,
} from 'react-native';
import { SamsungPayButton } from './index';
import type { SamsungPayProps } from '../../models/component_models/moyasar_props';
import { debugLog, errorLog } from '../../helpers/debug_log';
import { useEffect, useRef } from 'react';
import type { ResultCallback } from '../../models/payment_result';
import { PaymentRequest } from '../../models/api/api_requests/payment_request';
import { SamsungPayRequestSource } from '../../models/api/sources/samsung_pay/samsung_pay_request_source';
import { createPayment } from '../../services/payment_service';
import {
  GeneralError,
  isMoyasarError,
  NetworkError,
} from '../../models/errors/moyasar_errors';
import { PaymentConfig } from '../../models/payment_config';
import { toMajor } from '../../helpers/currency_util';
import { assert } from '../../helpers/assert';

export async function onSamsungPayResponse(
  token: string,
  orderNumber: string,
  paymentConfig: PaymentConfig,
  onPaymentResult: ResultCallback
) {
  const source = new SamsungPayRequestSource({
    samsungPayToken: token,
    manualPayment: paymentConfig.samsungPay?.manual,
  });

  const paymentRequest = new PaymentRequest({
    givenId: paymentConfig.givenId,
    amount: paymentConfig.amount,
    currency: paymentConfig.currency,
    description: paymentConfig.description,
    metadata: {
      ...(paymentConfig.metadata || {}),
      samsungpay_order_id: orderNumber, // This value must be supplied to native layer for Visa payments. Also for refund & chargebacks that's why we will send it to the backend
    },
    source: source,
  });

  debugLog('Moyasar SDK: Paying with Samsung Pay...');

  try {
    const paymentResponse = await createPayment(
      paymentRequest,
      paymentConfig.publishableApiKey
    );

    onPaymentResult(paymentResponse);
  } catch (error) {
    errorLog(`Moyasar SDK: Failed to pay with Samsung Pay, ${error}`);

    if (isMoyasarError(error)) {
      onPaymentResult(error);
    } else {
      onPaymentResult(
        new NetworkError(
          'Moyasar SDK: An error occured error while processing a Samsung Pay payment'
        )
      );
    }
  }
}

// If we can't get the manufacturer, assume it's a Samsung device. Native layer will handle it.
function isSamsungDevice(): boolean {
  if (Platform.OS !== 'android') return false;

  try {
    const manufacturer = NativeModules.PlatformConstants?.Manufacturer;
    if (!manufacturer) return true;

    const sanitized = manufacturer.toLowerCase().trim();
    return sanitized === 'samsung' || sanitized.includes('samsung');
  } catch (e) {
    debugLog(`Moyasar SDK: Error checking Samsung device: ${e}`);
    return true;
  }
}

const createFragment = (viewId: number | null) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // We are calling the 'create' command
    'CreateSamsungPayButtonFragment',
    [viewId]
  );

//  TODO: Support customizing the Samsung Pay button
export function SamsungPay({
  paymentConfig,
  onPaymentResult,
  style,
}: SamsungPayProps) {
  assert(
    !!paymentConfig.samsungPay,
    'Samsung Pay is not configured to use Samsung Pay, you have to configure the `samsungPay` property in the `PaymentConfig` object'
  );

  const ref = useRef(null);

  useEffect(() => {
    if (isSamsungDevice() && paymentConfig.samsungPay) {
      // Samsung Pay SDK initialization code
      const viewId = findNodeHandle(ref.current);
      if (viewId === null) {
        errorLog('Failed to get viewId for Samsung Pay');
        return;
      }

      debugLog('Moyasar SDK: Initializing Samsung Pay fragment...');
      // TODO: Try catch
      createFragment(viewId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Samsung Pay is in Samsung devices only, show empty view on other devices
  if (!isSamsungDevice() || !paymentConfig.samsungPay) {
    debugLog(
      'Moyasar SDK: Samsung Pay is not supported on this device or the `samsungPay` property is not set, showing empty view'
    );

    return <View />;
  }

  // TODO: Check why the button takes some top and bottom padding
  // If the below view is rendered but not visible,
  // it mostly mean that the Samsung device does not support Samsung Pay
  // or the device is not configured for it yet (There are other rare cases as well as implmented by Samsung)
  return (
    <View style={{ alignItems: 'center' }}>
      <SamsungPayButton
        style={{
          height: style?.height ?? 65,
          width: style?.width ?? '90%',
        }}
        merchantInfo={{
          serviceId: paymentConfig.samsungPay?.serviceId ?? '',
          merchantName: paymentConfig.samsungPay?.merchantName ?? '',
          merchantId: paymentConfig.publishableApiKey.substring(0, 15), // Currently, the merchantId will be part of the publishable API key
          merchantCountryCode: paymentConfig.merchantCountryCode,
          amount: toMajor(paymentConfig.amount, paymentConfig.currency),
          currency: paymentConfig.currency,
          supportedNetworks: paymentConfig.supportedNetworks,
          orderNumber: paymentConfig.samsungPay?.orderNumber,
          buttonBorderRadius: style?.cornerRadius,
        }}
        onPaymentResult={(result) => {
          if (!result.nativeEvent.result) {
            errorLog('Moyasar SDK: Samsung Pay result is empty or null');

            onPaymentResult(
              new GeneralError('Moyasar SDK: Samsung Pay token is null')
            );
            return;
          }

          const payload = JSON.parse(result.nativeEvent.result ?? '');

          onSamsungPayResponse(
            payload['3DS'].data,
            result.nativeEvent.orderNumber ?? '',
            paymentConfig,
            onPaymentResult
          );
        }}
        ref={ref}
      />
    </View>
  );
}
