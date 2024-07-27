import type { PaymentConfig } from './payment_config';
import type { PaymentRequestSource } from './sources/payment_request_source';

class PaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
  source: PaymentRequestSource;
  callbackUrl: string;

  constructor({
    config,
    source,
    callbackUrl,
  }: {
    config: PaymentConfig;
    source: PaymentRequestSource;
    callbackUrl: string;
  }) {
    this.amount = config.amount;
    this.currency = config.currency;
    this.description = config.description;
    this.metadata = config.metadata;
    this.source = source;
    this.callbackUrl = callbackUrl;
  }

  toJson(): Record<string, any> {
    return {
      amount: this.amount,
      source: this.source.toJson(),
      currency: this.currency,
      description: this.description,
      metadata: this.metadata,
      callback_url: this.callbackUrl,
    };
  }
}

export default PaymentRequest;
