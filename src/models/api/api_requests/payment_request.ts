import type { PaymentRequestSource } from '../sources/payment_request_source';

export class PaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
  source: PaymentRequestSource;
  callbackUrl: string;

  constructor({
    amount,
    currency,
    description,
    metadata,
    source,
    callbackUrl,
  }: {
    amount: number;
    currency: string;
    description?: string;
    metadata?: Record<string, string>;
    source: PaymentRequestSource;
    callbackUrl: string;
  }) {
    this.amount = amount;
    this.currency = currency;
    this.description = description;
    this.metadata = metadata;
    this.source = source;
    this.callbackUrl = callbackUrl;
  }

  toJson(): Record<string, any> {
    return {
      amount: this.amount,
      currency: this.currency,
      description: this.description,
      metadata: this.metadata,
      source: this.source.toJson(),
      callback_url: this.callbackUrl,
    };
  }
}
