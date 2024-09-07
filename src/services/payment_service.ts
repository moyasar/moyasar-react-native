import { debugLog, errorLog } from '../helpers/debug_log';
import type { PaymentRequest } from '../models/payment_request';
import { PaymentResponse } from '../models/payment_response';

const paymentsApiUrl = 'https://api.moyasar.com/v1/payments';

/** @Throws */
export async function createPayment(
  paymentRequest: PaymentRequest,
  publishableApiKey: string
) {
  debugLog('Moyasar SDK: Creating payment...');

  try {
    const response = await fetch(paymentsApiUrl, {
      method: 'POST',
      headers: buildRequestHeaders(publishableApiKey),
      body: JSON.stringify(paymentRequest.toJson()),
    });
    debugLog('Moyasar SDK: Got payment response...');

    if (!response.ok) {
      errorLog(
        `Moyasar SDK error: Failed to create payment with status code: ${response.status} and message: ${await response.text()}`
      );
      throw new Error('Error response from Moyasar API');
    }

    const paymentData = await response.json();
    debugLog(
      `Moyasar SDK: Payment created successfully, ${JSON.stringify(paymentData)}`
    );

    return PaymentResponse.fromJson(paymentData, paymentRequest.source.type);
  } catch (error) {
    errorLog(`Moyasar SDK error: Failed to create payment, ${error}`);
    throw error;
  }
}

function buildRequestHeaders(apiKey: string): Record<string, string> {
  const packageJson = require('../../package.json');
  const version = packageJson.version;

  return {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(apiKey)}`,
    'X-MOYASAR-LIB': 'moyasar-react-native-sdk',
    'X-REACT-NATIVE-SDK-VERSION': version,
  };
}
