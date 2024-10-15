import { debugLog, errorLog } from '../helpers/debug_log';
import { ApiError } from '../models/errors/api_error';
import {
  isMoyasarError,
  NetworkEndpointError,
  NetworkError,
  type MoyasarError,
} from '../models/errors/moyasar_errors';
import type { PaymentRequest } from '../models/api/api_requests/payment_request';
import { PaymentResponse } from '../models/api/api_responses/payment_response';
import type { TokenRequest } from '../models/api/api_requests/token_request';
import { TokenResponse } from '../models/api/api_responses/token_response';

const paymentsApiUrl = 'https://api.moyasar.com/v1/payments';
const tokenApiUrl = 'https://api.moyasar.com/v1/tokens';

/**
 * Makes a POST request.
 * @param url - The URL to send the request to.
 * @param jsonPayload - The encoded JSON payload to send.
 * @param publishableApiKey - Moyasar's publishable API key.
 *
 * @throws
 */
async function makeRequest(
  url: string,
  jsonPayload: string,
  publishableApiKey: string
): Promise<any> {
  debugLog('Moyasar SDK: Making backend request...');

  const response = await fetch(url, {
    method: 'POST',
    headers: buildRequestHeaders(publishableApiKey),
    body: jsonPayload,
  });
  debugLog('Moyasar SDK: Got backend response...');

  const responseJson = await response.json();

  if (!response.ok) {
    errorLog(
      `Moyasar SDK error: Backend request failed with status code: ${response.status} and message: ${JSON.stringify(responseJson)}`
    );

    throw new NetworkEndpointError(ApiError.fromJson(responseJson));
  }

  debugLog(
    `Moyasar SDK: Backend request successful, ${JSON.stringify(responseJson)}`
  );

  return responseJson;
}

/**
 * Initiates a payment.
 * @param paymentRequest - The payment request object.
 * @param publishableApiKey - Moyasar's publishable API key.
 */
export async function createPayment(
  paymentRequest: PaymentRequest,
  publishableApiKey: string
): Promise<PaymentResponse | MoyasarError> {
  const jsonPayload = JSON.stringify(paymentRequest.toJson());

  try {
    const paymentJson = await makeRequest(
      paymentsApiUrl,
      jsonPayload,
      publishableApiKey
    );

    return PaymentResponse.fromJson(paymentJson, paymentRequest.source.type);
  } catch (error) {
    return isMoyasarError(error)
      ? error
      : new NetworkError(
          'Moyasar SDK: An error occured while processing a Credit Card payment'
        );
  }
}

/**
 * Creates a Credit Card token.
 * @param tokenRequest - The token request object.
 * @param publishableApiKey - Moyasar's publishable API key.
 */
export async function createToken(
  tokenRequest: TokenRequest,
  publishableApiKey: string
): Promise<TokenResponse | MoyasarError> {
  const jsonPayload = JSON.stringify(tokenRequest.toJson());

  try {
    const paymentJson = await makeRequest(
      tokenApiUrl,
      jsonPayload,
      publishableApiKey
    );

    return TokenResponse.fromJson(paymentJson);
  } catch (error) {
    return isMoyasarError(error)
      ? error
      : new NetworkError(
          'Moyasar SDK: An error occured while creating a token request'
        );
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
