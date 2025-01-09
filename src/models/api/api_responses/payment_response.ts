import type { PaymentStatus } from '../../payment_status';
import { PaymentType } from '../../payment_type';
import { ApplePayPaymentResponseSource } from '../sources/apple_pay/apple_pay_response_source';
import { CreditCardResponseSource } from '../sources/credit_card/credit_card_response_source';
import type { PaymentResponseSource } from '../sources/payment_response_source';
import { StcPayResponseSource } from '../sources/stc_pay/stc_pay_response_source';

/**
 Moyasar API response for processing a payment.
 */
export class PaymentResponse {
  id: string;
  status: PaymentStatus;
  amount: number;
  fee: number;
  currency: string;
  refunded: number;
  refundedAt?: string;
  captured: number;
  capturedAt?: string;
  voidedAt?: string;
  description?: string;
  amountFormat: string;
  feeFormat: string;
  refundedFormat: string;
  capturedFormat: string;
  invoiceId?: string;
  ip?: string;
  callbackUrl?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, string | number | boolean> | null;
  source: PaymentResponseSource;

  constructor({
    id,
    status,
    amount,
    fee,
    currency,
    refunded,
    refundedAt,
    captured,
    capturedAt,
    voidedAt,
    description,
    amountFormat,
    feeFormat,
    refundedFormat,
    capturedFormat,
    invoiceId,
    ip,
    callbackUrl,
    createdAt,
    updatedAt,
    metadata,
    source,
  }: {
    id: string;
    status: PaymentStatus;
    amount: number;
    fee: number;
    currency: string;
    refunded: number;
    refundedAt?: string;
    captured: number;
    capturedAt?: string;
    voidedAt?: string;
    description?: string;
    amountFormat: string;
    feeFormat: string;
    refundedFormat: string;
    capturedFormat: string;
    invoiceId?: string;
    ip?: string;
    callbackUrl?: string;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, string | number | boolean> | null;
    source: PaymentResponseSource;
  }) {
    this.id = id;
    this.status = status;
    this.amount = amount;
    this.fee = fee;
    this.currency = currency;
    this.refunded = refunded;
    this.refundedAt = refundedAt;
    this.captured = captured;
    this.capturedAt = capturedAt;
    this.voidedAt = voidedAt;
    this.description = description;
    this.amountFormat = amountFormat;
    this.feeFormat = feeFormat;
    this.refundedFormat = refundedFormat;
    this.capturedFormat = capturedFormat;
    this.invoiceId = invoiceId;
    this.ip = ip;
    this.callbackUrl = callbackUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.metadata = metadata;
    this.source = source;
  }

  /**
   * Creates a new PaymentResponse instance from a JSON object.
   */
  static fromJson(
    json: Record<string, any>,
    paymentType: PaymentType
  ): PaymentResponse {
    let paymentSource: PaymentResponseSource;

    switch (paymentType) {
      case PaymentType.creditCard:
        paymentSource = CreditCardResponseSource.fromJson(json.source);
        break;
      case PaymentType.applePay:
        paymentSource = ApplePayPaymentResponseSource.fromJson(json.source);
        break;
      case PaymentType.stcPay:
        paymentSource = StcPayResponseSource.fromJson(json.source);
        break;
      default:
        paymentSource = json.source;
    }

    return new PaymentResponse({
      id: json.id,
      status: json.status,
      amount: json.amount,
      fee: json.fee,
      currency: json.currency,
      refunded: json.refunded,
      refundedAt: json.refunded_at,
      captured: json.captured,
      capturedAt: json.captured_at,
      voidedAt: json.voided_at,
      description: json.description,
      amountFormat: json.amount_format,
      feeFormat: json.fee_format,
      refundedFormat: json.refunded_format,
      capturedFormat: json.captured_format,
      invoiceId: json.invoice_id,
      ip: json.ip,
      callbackUrl: json.callback_url,
      createdAt: json.created_at,
      updatedAt: json.updated_at,
      metadata: json.metadata,
      source: paymentSource,
    });
  }
}
