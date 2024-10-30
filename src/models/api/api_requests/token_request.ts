/**
 * Constructs a TokenRequest object for creating a token for a Credit Card.
 * @param {string} name - Card holder’s name on the Credit Card.
 * @param {string} number - Credit Card number without any separators.
 * @param {string} cvc - Credit Card's security code.
 * @param {string} month - Two digit number representing the Credit Card's expiration month.
 * @param {string} year - Two or four digit number representing the Credit Card's expiration year.
 * @param {boolean | null} [saveOnly] - Optional
 * @param {string} callbackUrl - The URL to be redirected to after a 3D secure transaction (e.g., https://sdk.moyasar.com/return).
 * @param {Record<string, string | number | boolean> | null} [metadata] - Adds searchable key/value pairs to the payment. For example `{"size": "xl"}`.
 */
export class TokenRequest {
  name: string;
  number: string;
  cvc: string;
  month: string;
  year: string;
  saveOnly?: boolean | null;
  callbackUrl: string;
  metadata?: Record<string, string | number | boolean> | null;

  constructor({
    name,
    number,
    cvc,
    month,
    year,
    saveOnly,
    callbackUrl,
    metadata,
  }: {
    name: string;
    number: string;
    cvc: string;
    month: string;
    year: string;
    saveOnly?: boolean | null;
    callbackUrl: string;
    metadata?: Record<string, string | number | boolean> | null;
  }) {
    this.name = name;
    this.number = number;
    this.cvc = cvc;
    this.month = month;
    this.year = year;
    this.saveOnly = saveOnly;
    this.callbackUrl = callbackUrl;
    this.metadata = metadata;
  }

  toJson(): Record<string, any> {
    return {
      name: this.name,
      number: this.number,
      cvc: this.cvc,
      month: this.month,
      year: this.year,
      save_only: this.saveOnly,
      callback_url: this.callbackUrl,
      metadata: this.metadata,
    };
  }
}
