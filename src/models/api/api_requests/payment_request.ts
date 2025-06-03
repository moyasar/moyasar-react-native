import type { PaymentRequestSource } from '../sources/payment_request_source';

/**
 * Constructs a PaymentRequest object for creating a payment.
 * @param {givenId | null} [givenId] - Optional UUID for the payment (UUID v4 is recommended). It will be attached with the payment creation request to support idempotency. `It is going be the ID of the created payment`.
 * @param {number} amount - The amount to be charged in the smallest currency unit. For example, to charge `SAR 257.58` you will have the [amount] as `25758`. In other words, 10 SAR = 10 * 100 Halalas. Integer values only.
 * @param {string} [currency='SAR'] - The currency code for the payment. Defaults to 'SAR'. Must be in ISO 4217 3-letter currency code format.
 * @param {string | null} [description] - Can be any string you want to tag the payment. For example `Payment for Order #34321`.
 * @param {Record<string, string | number | boolean> | null} [metadata] - Adds searchable key/value pairs to the payment. For example `{"size": "xl"}`.
 * @param {PaymentRequestSource} source - A payment source object to be charged, such as Apple Pay source or Credit Card source.
 * @param {string | null} [callbackUrl] - The URL to be redirected to after a 3D secure transaction (e.g., https://sdk.moyasar.com/return). Required for Credit Card payments.
 */
export class PaymentRequest {
  givenId?: string | null;
  amount: number;
  currency: string;
  description?: string | null;
  metadata?: Record<string, string | number | boolean> | null;
  source: PaymentRequestSource;
  callbackUrl?: string | null;

  constructor({
    givenId,
    amount,
    currency = 'SAR',
    description,
    metadata,
    source,
    callbackUrl,
  }: {
    givenId?: string | null;
    amount: number;
    currency?: string;
    description?: string | null;
    metadata?: Record<string, string | number | boolean> | null;
    source: PaymentRequestSource;
    callbackUrl?: string | null;
  }) {
    this.givenId = givenId;
    this.amount = amount;
    this.currency = currency;
    this.description = description;
    this.metadata = metadata;
    this.source = source;
    this.callbackUrl = callbackUrl;
  }

  toJson(): Record<string, any> {
    return {
      ...(this.givenId && { given_id: this.givenId }),
      amount: this.amount,
      currency: this.currency,
      description: this.description,
      metadata: this.metadata,
      source: this.source.toJson(),
      callback_url: this.callbackUrl,
    };
  }
}
