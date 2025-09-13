import { Buffer } from 'buffer';
import { debugLog, errorLog } from '../helpers/debug_log';
import { ApiError } from '../models/errors/api_error';
import {
  isMoyasarError,
  NetworkEndpointError,
  NetworkError,
  UnableToFetchPaymentStatus,
  type MoyasarError,
} from '../models/errors/moyasar_errors';
import type { PaymentRequest } from '../models/api/api_requests/payment_request';
import { PaymentResponse } from '../models/api/api_responses/payment_response';
import type { TokenRequest } from '../models/api/api_requests/token_request';
import { TokenResponse } from '../models/api/api_responses/token_response';
import { PaymentType } from '../models/payment_type';

const paymentsApiUrl = 'https://api.moyasar.com/v1/payments';
const tokenApiUrl = 'https://api.moyasar.com/v1/tokens';

/**
 * Makes a network API request.
 * @param baseUrl - The base URL for the request
 * @param publishableApiKey - Moyasar's publishable API key
 * @param options - Request options
 * @param options.method - HTTP method (GET or POST). Defaults to POST
 * @param options.jsonPayload - The JSON payload (for POST requests)
 * @param options.pathParams - Path parameters to append to the URL (e.g. ['ID123', 'Order123'])
 */
async function makeRequest(
  baseUrl: string,
  publishableApiKey?: string,
  options: {
    method?: 'GET' | 'POST';
    jsonPayload?: Record<string, any>;
    pathParams?: string[];
  } = {}
): Promise<any> {
  const { method = 'POST', pathParams = [], jsonPayload } = options;

  // Build URL with path parameters
  let url = baseUrl;
  if (pathParams.length > 0) {
    url = url.endsWith('/') ? url.slice(0, -1) : url;
    url += '/' + pathParams.map((path) => encodeURIComponent(path)).join('/');
  }

  debugLog(`Moyasar SDK: Making ${method}...`);

  // Build request and headers
  const requestOptions: RequestInit = {
    method,
    headers: publishableApiKey
      ? buildRequestHeaders(publishableApiKey)
      : buildRequestHeaders(),
  };

  // Add body for POST requests
  if (method === 'POST' && jsonPayload !== undefined) {
    requestOptions.body = JSON.stringify(jsonPayload);
  }

  const response = await fetch(url, requestOptions);
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
  try {
    const paymentJson = await makeRequest(paymentsApiUrl, publishableApiKey, {
      jsonPayload: paymentRequest.toJson(),
    });

    return PaymentResponse.fromJson(paymentJson, paymentRequest.source.type);
  } catch (error) {
    errorLog(
      `Moyasar SDK: An error occured while processing a Credit Card payment: ${error}`
    );

    return isMoyasarError(error)
      ? error
      : new NetworkError(
          'Moyasar SDK: An error occured while processing a Credit Card payment'
        );
  }
}

/**
 * Fetches a payment with it's ID
 * @param paymentId - The ID of the payment to fetch.
 * @param publishableApiKey - Moyasar's publishable API key.
 * @param paymentSource - The source of the payment. Defaults to PaymentType.creditCard.
 */
export async function fetchPayment(
  paymentId: string,
  publishableApiKey: string,
  paymentSource: PaymentType = PaymentType.creditCard
): Promise<PaymentResponse | MoyasarError> {
  try {
    const paymentJson = await makeRequest(paymentsApiUrl, publishableApiKey, {
      method: 'GET',
      pathParams: [paymentId],
    });

    return PaymentResponse.fromJson(paymentJson, paymentSource);
  } catch (error) {
    errorLog(`Moyasar SDK: Fetching payment failed with error: ${error}`);

    return new UnableToFetchPaymentStatus(
      isMoyasarError(error)
        ? `Moyasar SDK: An error occured while fetching the payment with ID ${paymentId}, error: ${error.message}`
        : `Moyasar SDK: An error occured while fetching the payment with ID ${paymentId}`,
      paymentId
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
  try {
    const paymentJson = await makeRequest(tokenApiUrl, publishableApiKey, {
      jsonPayload: tokenRequest.toJson(),
    });

    return TokenResponse.fromJson(paymentJson);
  } catch (error) {
    errorLog(
      `Moyasar SDK: An error occured while creating a token request: ${error}`
    );

    return isMoyasarError(error)
      ? error
      : new NetworkError(
          'Moyasar SDK: An error occured while creating a token request'
        );
  }
}

/**
 * Sends an OTP (One-Time Password) to the specified URL for payment processing.
 * @param otp - The OTP value to be sent.
 * @param url - The URL to which the OTP should be sent.
 * @param paymentSource - The source of the payment. Defaults to PaymentType.stcPay.
 */
export async function sendOtp(
  otp: string,
  url: string,
  paymentSource: PaymentType = PaymentType.stcPay
): Promise<PaymentResponse | MoyasarError> {
  try {
    const paymentJson = await makeRequest(url, undefined, {
      jsonPayload: { otp_value: otp },
    });

    return PaymentResponse.fromJson(paymentJson, paymentSource);
  } catch (error) {
    errorLog(
      `Moyasar SDK: An error occured while sending the OTP for a payment: ${error}`
    );

    return isMoyasarError(error)
      ? error
      : new NetworkError(
          'Moyasar SDK: An error occured while sending the OTP for a payment'
        );
  }
}

function buildRequestHeaders(apiKey?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-MOYASAR-LIB': 'moyasar-react-native-sdk',
    // TODO: Find a better solution for getting the version number to avoid hardcoding it. Importing the package.json file had its own issues after migrating the SDK's tooling and configuration.
    'X-REACT-NATIVE-SDK-VERSION': '0.10.0',
  };

  if (apiKey) {
    headers['Authorization'] =
      `Basic ${Buffer.from(apiKey).toString('base64')}`;
  }

  return headers;
}
