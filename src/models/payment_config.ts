import { assert } from '../helpers/assert';
import type { ApplePayConfig } from './apple_pay_config';
import { CreditCardConfig } from './credit_card_config';

/**
 Used by Moyasar API along with any of the supported sources. 
 */
export class PaymentConfig {
  publishableApiKey: string;
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
  supportedNetworks: string[];
  applePay?: ApplePayConfig;
  creditCard: CreditCardConfig;

  /**
   * Constructs a new PaymentConfig instance with the provided settings.
   * @param publishableApiKey - Your Moyasar publishable API key - https://docs.moyasar.com/get-your-api-keys.
   * @param amount - The amount to be charged in the smallest currency unit. For example, to charge `SAR 257.58` you will have the [amount] as `25758`. In other words, 10 SAR = 10 * 100 Halalas. Integer values only.
   * @param currency - The currency code for the payment. Defaults to 'SAR'. Must be in ISO 3166-1 alpha-3 country code format.
   * @param description - Can be any string you want to tag the payment. For example `Payment for Order #34321`.
   * @param metadata - The [metadata] adds searchable key/value pairs to the payment. For example `{"size": "xl"}`.
   * @param supportedNetworks - Card networks supported for Apple Pay. Defaults to ['mada', 'visa', 'mastercard', 'amex'].
   * @param applePay - Required for Apple Pay feature.
   * @param creditCard - Optional for Credit Card feature.
   */
  constructor({
    publishableApiKey,
    amount,
    currency = 'SAR',
    description,
    metadata,
    supportedNetworks = ['mada', 'visa', 'mastercard', 'amex'],
    applePay,
    creditCard = new CreditCardConfig({}),
  }: {
    publishableApiKey: string;
    amount: number;
    currency?: string;
    description: string;
    metadata?: Record<string, string>;
    supportedNetworks?: string[];
    applePay?: ApplePayConfig;
    creditCard?: CreditCardConfig;
  }) {
    assert(
      publishableApiKey.length > 0,
      'Please fill `publishableApiKey` argument with your key.'
    );
    assert(Number.isInteger(amount), 'Amount must be an integer.');
    assert(amount > 0, 'Amount must be a positive integer.');
    assert(description.length > 0, 'Please add a description.');
    assert(
      supportedNetworks.length > 0,
      'At least 1 network must be supported.'
    );

    this.publishableApiKey = publishableApiKey;
    this.amount = amount;
    this.currency = currency;
    this.description = description;
    this.metadata = metadata;
    this.supportedNetworks = supportedNetworks;
    this.applePay = applePay;
    this.creditCard = creditCard;
  }
}
