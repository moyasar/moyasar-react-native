export class TokenRequest {
  name: string;
  number: string;
  cvc: string;
  month: string;
  year: string;
  saveOnly?: boolean;
  callbackUrl: string;
  metadata?: Record<string, string>;

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
    saveOnly?: boolean;
    callbackUrl: string;
    metadata?: Record<string, string>;
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
