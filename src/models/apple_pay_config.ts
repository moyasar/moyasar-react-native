/**
 Required configuration to setup Apple Pay.
 */
export class ApplePayConfig {
  merchantId: string;
  label: string;
  manual: boolean;
  saveCard?: boolean;

  /**
   * Constructs a new ApplePayConfig instance with the provided settings.
   * @param merchantId - The merchant id configured in the Moyasar Dashboard and Xcode.
   * @param label - The store name to be displayed in the Apple Pay payment session.
   * @param manual - An option to enable the manual auth and capture.
   * @param saveCard - An option to save (tokenize) the card after a successful payment.
   */
  constructor({
    merchantId,
    label,
    manual = false,
    saveCard = false,
  }: {
    merchantId: string;
    label: string;
    manual?: boolean;
    saveCard?: boolean;
  }) {
    this.merchantId = merchantId;
    this.label = label;
    this.manual = manual;
    this.saveCard = saveCard;
  }
}
