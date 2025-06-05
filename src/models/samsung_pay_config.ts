/**
 Required configuration to setup Samsung Pay.
 */
export class SamsungPayConfig {
  serviceId: string;
  merchantName: string;
  orderNumber?: string | null;
  manual: boolean;

  /**
   * Constructs a new SamsungPayConfig instance with the provided settings.
   * @param serviceId - The service ID generated in the Samsung merchant dashboard (e.g. ea810dafb758408fa530b1).
   * @param merchantName - The merchant name to be displayed in the Samsung Pay payment session.
   * @param orderNumber - A unique identifier for the transaction:
   *   - Needed for refunds, chargebacks, and Visa card payments
   *   - Must be only alphanumeric characters and hyphens [A-Za-z0-9-]
   *   - Maximum length: 36 characters
   *   - If omitted, the SDK generates a UUID automatically
   *   - Appears in the response `metadata` in a 'samsungpay_order_id' field upon successful payment (paymentResult.metadata.samsungpay_order_id)
   *   - Recommended format: Use a unique, traceable ID that can be linked to your system
   *   - Note: Make sure to regenerate a new order number for each transaction
   * @param manual - An option to enable the manual auth and capture.
   */
  constructor({
    serviceId,
    merchantName,
    orderNumber,
    manual = false,
  }: {
    serviceId: string;
    merchantName: string;
    orderNumber?: string | null;
    manual?: boolean;
  }) {
    this.serviceId = serviceId;
    this.merchantName = merchantName;
    this.orderNumber = orderNumber;
    this.manual = manual;
  }
}
