/**
 * @param splits - Optional array of `PaymentSplit` object used to distribute the charged amount (in the smallest currency unit) among multiple recipients or to collect a platform fee.
 *   - Each split requires `recipientId` and `amount` parameters.
 *   - `reference` and `description` parameters are optional.
 *   - Set `feeSource = true` parameter to mark the split as a fee/commission taken by the platform.
 *   - Set `refundable` parameter to control whether a split amount is refundable (`true`/`false`). Leave it to use the backend's default.
 *   - Set the `publishableApiKey` parameter to "pk_test_uQra5pwtUo9GaenMSS4XgfAmeLhmjUTJwFdXJxsH" and set the `baseUrl` parameter to "https://apimig.moyasar.com" for staging testing.
 */
export class PaymentSplit {
  public recipientId: string;
  public amount: number;
  public reference?: string | null;
  public description?: string | null;
  public feeSource?: boolean | null;
  public refundable?: boolean | null;

  constructor({
    recipientId,
    amount,
    reference,
    description,
    feeSource,
    refundable,
  }: {
    recipientId: string;
    amount: number;
    reference?: string | null;
    description?: string | null;
    feeSource?: boolean | null;
    refundable?: boolean | null;
  }) {
    this.recipientId = recipientId;
    this.amount = amount;
    this.reference = reference;
    this.description = description;
    this.feeSource = feeSource;
    this.refundable = refundable;
  }

  toJson(): Record<string, any> {
    return {
      recipient_id: this.recipientId,
      amount: this.amount,
      ...(this.reference && { reference: this.reference }),
      ...(this.description && { description: this.description }),
      ...(this.feeSource !== undefined && { fee_source: this.feeSource }),
      ...(this.refundable !== undefined && { refundable: this.refundable }),
    };
  }

  static fromJson(json: Record<string, any>): PaymentSplit {
    return new PaymentSplit({
      recipientId: json.recipient_id,
      amount: json.amount,
      reference: json.reference,
      description: json.description,
      feeSource: json.fee_source,
      refundable: json.refundable,
    });
  }
}
