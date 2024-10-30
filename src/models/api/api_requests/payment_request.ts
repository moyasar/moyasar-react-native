import type { PaymentRequestSource } from '../sources/payment_request_source';

/**
 * Constructs a PaymentRequest object for creating a payment.
 * @param {number} amount - The amount to be charged in the smallest currency unit. For example, to charge `SAR 257.58` you will have the [amount] as `25758`. In other words, 10 SAR = 10 * 100 Halalas. Integer values only.
 * @param {string} [currency='SAR'] - The currency code for the payment. Defaults to 'SAR'. Must be in ISO 3166-1 alpha-3 country code format.
 * @param {string | null} [description] - Can be any string you want to tag the payment. For example `Payment for Order #34321`.
 * @param {Record<string, string | number | boolean> | null} [metadata] - Adds searchable key/value pairs to the payment. For example `{"size": "xl"}`.
 * @param {PaymentRequestSource} source - A payment source object to be charged, such as Apple Pay source or Credit Card source.
 * @param {string | null} [callbackUrl] - The URL to be redirected to after a 3D secure transaction (e.g., https://sdk.moyasar.com/return). Required for Credit Card payments.
 */
export class PaymentRequest {
  amount: number;
  currency: string;
  description?: string | null;
  metadata?: Record<string, string | number | boolean> | null;
  source: PaymentRequestSource;
  callbackUrl?: string | null;

  constructor({
    amount,
    currency = 'SAR',
    description,
    metadata,
    source,
    callbackUrl,
  }: {
    amount: number;
    currency?: string;
    description?: string | null;
    metadata?: Record<string, string | number | boolean> | null;
    source: PaymentRequestSource;
    callbackUrl?: string | null;
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
