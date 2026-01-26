import { assert } from '../helpers/assert';
import type { ApplePayConfig } from './apple_pay_config';
import { CreditCardConfig } from './credit_card_config';
import type { PaymentSplit } from './payment_split';
import type { SamsungPayConfig } from './samsung_pay_config';

/**
 Used by Moyasar API along with any of the supported sources. 
 */
export class PaymentConfig {
  givenId?: string | null;
  publishableApiKey: string;
  baseUrl: string;
  amount: number;
  merchantCountryCode: string;
  currency: string;
  description: string;
  metadata?: Record<string, string | number | boolean> | null;
  supportedNetworks: string[];
  applePay?: ApplePayConfig;
  creditCard: CreditCardConfig;
  createSaveOnlyToken: boolean;
  samsungPay?: SamsungPayConfig;
  applyCoupon?: boolean;
  splits?: PaymentSplit[] | null;

  /**
   * Constructs a new PaymentConfig instance with the provided settings.
   * @param givenId - Optional UUID for the payment (UUID v4 is recommended). It will be attached with the payment creation request to support idempotency. `It is going be the ID of the created payment`.
   * @param publishableApiKey - Your Moyasar publishable API key - https://docs.moyasar.com/get-your-api-keys.
   * @param baseUrl - Moyasar API base URL. Defaults to `https://api.moyasar.com`.
   * @param amount - The amount to be charged in the smallest currency unit. For example, to charge `SAR 257.58` you will have the [amount] as `25758`. In other words, 10 SAR = 10 * 100 Halalas. Integer values only.
   * @param merchantCountryCode - The country code of the merchant’s principle place of business. Defaults to 'SA'. Must be in ISO 3166-1 alpha-2 country code format.
   * @param currency - The currency code for the payment. Defaults to 'SAR'. Must be in ISO 4217 3-letter currency code format.
   * @param description - Can be any string you want to tag the payment. For example `Payment for Order #34321`.
   * @param metadata - Adds searchable key/value pairs to the payment. For example `{"size": "xl"}`.
   * @param supportedNetworks - Card networks supported for Apple Pay & Samsung Pay. Defaults to all available: ['mada', 'visa', 'mastercard', 'amex'].
   * @param applePay - Required for Apple Pay feature.
   * @param creditCard - Optional for Credit Card feature.
   * @param createSaveOnlyToken - Optional to process a save only token flow for a Credit Card. Defaults to false - https://docs.moyasar.com/create-token
   * @param samsungPay - Required for Samsung Pay feature.
   * @param applyCoupon - A flag to control the coupon application (based on the BIN). This key is required only if you don't want to apply the coupon. Otherwise, the coupon is going to be applied. Defaults to true.
   * @param splits - Optional array of payment splitting.
   */
  constructor({
    givenId,
    publishableApiKey,
    baseUrl = 'https://api.moyasar.com',
    amount,
    merchantCountryCode = 'SA',
    currency = 'SAR',
    description,
    metadata,
    supportedNetworks = ['mada', 'visa', 'mastercard', 'amex'],
    applePay,
    creditCard = new CreditCardConfig({}),
    createSaveOnlyToken = false,
    samsungPay,
    applyCoupon = true,
    splits,
  }: {
    givenId?: string | null;
    publishableApiKey: string;
    baseUrl?: string;
    amount: number;
    merchantCountryCode?: string;
    currency?: string;
    description: string;
    metadata?: Record<string, string | number | boolean> | null;
    supportedNetworks?: string[];
    applePay?: ApplePayConfig;
    creditCard?: CreditCardConfig;
    createSaveOnlyToken?: boolean;
    samsungPay?: SamsungPayConfig;
    applyCoupon?: boolean;
    splits?: PaymentSplit[] | null;
  }) {
    assert(
      publishableApiKey.length > 0,
      'Please fill `publishableApiKey` argument with your key.'
    );
    assert(Number.isInteger(amount), 'Amount must be an integer.');
    assert(amount > 0, 'Amount must be a positive integer.');
    assert(
      merchantCountryCode.length > 0,
      'Please fill `merchantCountryCode` argument (ISO 3166-1 alpha-2 country code).'
    );
    assert(
      currency.length > 0,
      'Please fill `currency` argument (ISO 4217 3-letter currency code).'
    );
    assert(description.length > 0, 'Please add a description.');
    assert(
      supportedNetworks.length > 0,
      'At least 1 network must be supported.'
    );

    this.givenId = givenId;
    this.publishableApiKey = publishableApiKey;

    const cleanedBaseUrl = baseUrl.replace(/\/+$/, ''); // Removes trailing slashes
    this.baseUrl = cleanedBaseUrl;
    this.amount = amount;
    this.merchantCountryCode = merchantCountryCode.toUpperCase();
    this.currency = currency;
    this.description = description;
    this.metadata = metadata;
    this.supportedNetworks = supportedNetworks.map((network) =>
      network.toLowerCase()
    );
    this.applePay = applePay;
    this.creditCard = creditCard;
    this.createSaveOnlyToken = createSaveOnlyToken;
    this.samsungPay = samsungPay;
    this.applyCoupon = applyCoupon;
    this.splits = splits;
  }
}
