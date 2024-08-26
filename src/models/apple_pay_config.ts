/**
 Required configuration to setup Apple Pay.
 */
export class ApplePayConfig {
  merchantId: string;
  label: string;
  manual: boolean;

  /**
   * Constructs a new ApplePayConfig instance with the provided settings.
   * @param merchantId - The merchant id configured in the Moyasar Dashboard and Xcode.
   * @param label - The store name to be displayed in the Apple Pay payment session.
   * @param manual - An option to enable the manual auth and capture.
   */
  constructor({
    merchantId,
    label,
    manual = false,
  }: {
    merchantId: string;
    label: string;
    manual?: boolean;
  }) {
    this.merchantId = merchantId;
    this.label = label;
    this.manual = manual;
  }
}
