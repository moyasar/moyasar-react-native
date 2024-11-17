import type { PaymentResponse } from '../api/api_responses/payment_response';
import type { ApiError } from './api_error';

export type MoyasarError =
  | NetworkError
  | NetworkEndpointError
  | GeneralError
  | UnexpectedError;

// Extend it, don't use it directly
abstract class MoyasarBaseError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends MoyasarBaseError {
  constructor(message: string) {
    super(message);

    this.name = 'MoyasarNetworkError';
  }
}

export class NetworkEndpointError extends MoyasarBaseError {
  error: ApiError;

  constructor(error: ApiError) {
    super(error.message ?? 'Network endpoint error');

    this.error = error;
    this.name = 'MoyasarNetworkEndpointError';
  }
}

export class GeneralError extends MoyasarBaseError {
  constructor(message: string) {
    super(message);

    this.name = 'MoyasarGeneralError';
  }
}

export class UnexpectedError extends MoyasarBaseError {
  pendingPayment?: PaymentResponse | null;

  constructor(message: string, pendingPayment?: PaymentResponse | null) {
    super(message);

    this.name = 'MoyasarUnexpectedError';
    this.pendingPayment = pendingPayment;
  }
}

export function isMoyasarError(error: any): error is MoyasarError {
  return error instanceof MoyasarBaseError;
}
