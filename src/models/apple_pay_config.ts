import { assert } from '../helpers/assert';

/**
 Required configuration to setup Apple Pay.
 */
export class ApplePayConfig {
  merchantId: string;
  label: string;
  manual: boolean;
  merchantCapabilities: string[];

  /**
   * Constructs a new ApplePayConfig instance with the provided settings.
   * @param merchantId - The merchant id configured in the Moyasar Dashboard and Xcode.
   * @param label - The store name to be displayed in the Apple Pay payment session.
   * @param manual - An option to enable the manual auth and capture.
   * @param merchantCapabilities - Payment capabilities that the merchant supports. Defaults to ['3ds', 'debit', 'credit'].
   */
  constructor({
    merchantId,
    label,
    manual = false,
    merchantCapabilities = ['3ds', 'debit', 'credit'],
  }: {
    merchantId: string;
    label: string;
    manual?: boolean;
    merchantCapabilities?: string[];
  }) {
    assert(
      merchantCapabilities.includes('3ds'),
      'Merchant capabilities must contain 3ds.'
    );

    this.merchantId = merchantId;
    this.label = label;
    this.manual = manual;
    this.merchantCapabilities = merchantCapabilities;
  }
}
