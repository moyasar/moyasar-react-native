import type { PaymentSplit } from '../../payment_split';
import type { PaymentRequestSource } from '../sources/payment_request_source';

/**
 * Constructs a PaymentRequest object for creating a payment.
 * @param {givenId | null} [givenId] - Optional UUID for the payment (UUID v4 is recommended). It will be attached with the payment creation request to support idempotency. `It is going be the ID of the created payment`.
 * @param {string} [baseUrl='https://api.moyasar.com'] - The base URL for Moyasar API. Defaults to 'https://api.moyasar.com'.
 * @param {number} amount - The amount to be charged in the smallest currency unit. For example, to charge `SAR 257.58` you will have the [amount] as `25758`. In other words, 10 SAR = 10 * 100 Halalas. Integer values only.
 * @param {string} [currency='SAR'] - The currency code for the payment. Defaults to 'SAR'. Must be in ISO 4217 3-letter currency code format.
 * @param {string | null} [description] - Can be any string you want to tag the payment. For example `Payment for Order #34321`.
 * @param {Record<string, string | number | boolean> | null} [metadata] - Adds searchable key/value pairs to the payment. For example `{"size": "xl"}`.
 * @param {PaymentRequestSource} source - A payment source object to be charged, such as Apple Pay source or Credit Card source.
 * @param {string | null} [callbackUrl] - The URL to be redirected to after a 3D secure transaction (e.g., https://sdk.moyasar.com/return). Required for Credit Card payments.
 * @param {boolean} [applyCoupon=true] - A flag to control the coupon application (based on the BIN). This key is required only if you don't want to apply the coupon. Otherwise, the coupon is going to be applied. Defaults to true.
 * @param {PaymentSplit[] | null} [splits] - Optional array of `PaymentSplit` object used to distribute the charged amount (in the smallest currency unit) among multiple recipients or to collect a platform fee.
 *   - Each split requires `recipientId` and `amount` parameters.
 *   - `reference` and `description` parameters are optional.
 *   - Set `feeSource = true` parameter to mark the split as a fee/commission taken by the platform.
 *   - Set `refundable` parameter to control whether a split amount is refundable (`true`/`false`), or leave `undefined` to use the backend default.
 *   - Set the `publishableApiKey` to "pk_test_uQra5pwtUo9GaenMSS4XgfAmeLhmjUTJwFdXJxsH" and set the `baseUrl` parameter to "https://apimig.moyasar.com" for staging testing.
 */
export class PaymentRequest {
  givenId?: string | null;
  baseUrl: string;
  amount: number;
  currency: string;
  description?: string | null;
  metadata?: Record<string, string | number | boolean> | null;
  source: PaymentRequestSource;
  callbackUrl?: string | null;
  applyCoupon?: boolean;
  splits?: PaymentSplit[] | null;

  constructor({
    givenId,
    baseUrl = 'https://api.moyasar.com',
    amount,
    currency = 'SAR',
    description,
    metadata,
    source,
    callbackUrl,
    applyCoupon = true,
    splits,
  }: {
    givenId?: string | null;
    baseUrl?: string;
    amount: number;
    currency?: string;
    description?: string | null;
    metadata?: Record<string, string | number | boolean> | null;
    source: PaymentRequestSource;
    callbackUrl?: string | null;
    applyCoupon?: boolean;
    splits?: PaymentSplit[] | null;
  }) {
    this.givenId = givenId;
    this.baseUrl = baseUrl;
    this.amount = amount;
    this.currency = currency;
    this.description = description;
    this.metadata = metadata;
    this.source = source;
    this.callbackUrl = callbackUrl;
    this.applyCoupon = applyCoupon;
    this.splits = splits;
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
      apply_coupon: this.applyCoupon ?? true,
      splits: this.splits?.map((split) => split.toJson()),
    };
  }
}
