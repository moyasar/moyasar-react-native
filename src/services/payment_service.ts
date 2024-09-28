import { debugLog, errorLog } from '../helpers/debug_log';
import { ApiError } from '../models/errors/api_error';
import { NetworkEndpointError } from '../models/errors/moyasar_errors';
import type { PaymentRequest } from '../models/payment_request';
import { PaymentResponse } from '../models/payment_response';

const paymentsApiUrl = 'https://api.moyasar.com/v1/payments';

/** @Throws */
export async function createPayment(
  paymentRequest: PaymentRequest,
  publishableApiKey: string
): Promise<PaymentResponse> {
  debugLog('Moyasar SDK: Creating payment...');

  const response = await fetch(paymentsApiUrl, {
    method: 'POST',
    headers: buildRequestHeaders(publishableApiKey),
    body: JSON.stringify(paymentRequest.toJson()),
  });
  debugLog('Moyasar SDK: Got payment response...');

  const paymentJson = await response.json();

  if (!response.ok) {
    errorLog(
      `Moyasar SDK error: Failed to create payment with status code: ${response.status} and message: ${JSON.stringify(paymentJson)}`
    );

    throw new NetworkEndpointError(ApiError.fromJson(paymentJson));
  }

  debugLog(
    `Moyasar SDK: Payment created successfully, ${JSON.stringify(paymentJson)}`
  );

  return PaymentResponse.fromJson(paymentJson, paymentRequest.source.type);
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
