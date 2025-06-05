import { PaymentType } from '../../../payment_type';
import type { PaymentResponseSource } from '../payment_response_source';

export class SamsungPayPaymentResponseSource implements PaymentResponseSource {
  type: PaymentType = PaymentType.samsungPay;
  number: string;
  gatewayId: string;
  referenceNumber?: string;
  message?: string;

  constructor({
    number,
    gatewayId,
    referenceNumber,
    message,
  }: {
    number: string;
    gatewayId: string;
    referenceNumber?: string;
    message?: string;
  }) {
    this.number = number;
    this.gatewayId = gatewayId;
    this.referenceNumber = referenceNumber;
    this.message = message;
  }

  static fromJson(json: Record<string, any>): SamsungPayPaymentResponseSource {
    // TODO: Should we support more fields? Also for Apple Pay
    return new SamsungPayPaymentResponseSource({
      number: json.number,
      gatewayId: json.gateway_id,
      referenceNumber: json.reference_number,
      message: json.message,
    });
  }
}
