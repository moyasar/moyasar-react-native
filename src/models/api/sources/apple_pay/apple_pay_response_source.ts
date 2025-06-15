import { PaymentType } from '../../../payment_type';
import type { PaymentResponseSource } from '../payment_response_source';

export class ApplePayPaymentResponseSource implements PaymentResponseSource {
  type: PaymentType = PaymentType.applePay;
  number: string;
  gatewayId: string;
  referenceNumber?: string;
  message?: string;
  token?: string;

  constructor({
    number,
    gatewayId,
    referenceNumber,
    message,
    token,
  }: {
    number: string;
    gatewayId: string;
    referenceNumber?: string;
    message?: string;
    token?: string;
  }) {
    this.number = number;
    this.gatewayId = gatewayId;
    this.referenceNumber = referenceNumber;
    this.message = message;
    this.token = token;
  }

  static fromJson(json: Record<string, any>): ApplePayPaymentResponseSource {
    return new ApplePayPaymentResponseSource({
      number: json.number,
      gatewayId: json.gateway_id,
      referenceNumber: json.reference_number,
      message: json.message,
      token: json.token,
    });
  }
}
