import type { PaymentResponse } from './api/api_responses/payment_response';
import type { TokenResponse } from './api/api_responses/token_response';
import type { MoyasarError } from './errors/moyasar_errors';

export type PaymentResult = PaymentResponse | TokenResponse | MoyasarError;
export type ResultCallback = (paymentResult: PaymentResult) => void;
