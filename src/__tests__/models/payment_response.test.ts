import { PaymentResponse } from '../../models/api/api_responses/payment_response';
import { PaymentType } from '../../models/payment_type';
import { CreditCardResponseSource } from '../../models/api/sources/credit_card/credit_card_response_source';

describe('PaymentResponse', () => {
  it('should create a PaymentResponse instance from JSON with credit card source with all params', () => {
    const json = {
      id: '123',
      status: 'initiated',
      amount: 10000,
      fee: 50,
      currency: 'SAR',
      refunded: 0,
      captured: 1000,
      captured_at: '2023-01-01T00:00:00Z',
      voided_at: '2023-01-01T00:00:00Z',
      description: 'Payment for order #123',
      amount_format: '10.00',
      fee_format: '0.50',
      refunded_format: '0.00',
      captured_format: '10.00',
      invoice_id: '123',
      ip: '8.8.8.8',
      callback_url: 'https://example.com/callback',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      metadata: { orderId: '12345' },
      source: {
        company: 'visa',
        name: 'John Doe',
        number: '4111111111111111',
        gateway_id: '12345',
        transaction_url: '123456',
        reference_number: '123',
        token: 'token',
        message: 'message123',
      },
    };

    const paymentResponse = PaymentResponse.fromJson(
      json,
      PaymentType.creditCard
    );

    expect(paymentResponse.id).toBe(json.id);
    expect(paymentResponse.status).toBe(json.status);
    expect(paymentResponse.amount).toBe(json.amount);
    expect(paymentResponse.fee).toBe(json.fee);
    expect(paymentResponse.currency).toBe(json.currency);
    expect(paymentResponse.refunded).toBe(json.refunded);
    expect(paymentResponse.captured).toBe(json.captured);
    expect(paymentResponse.capturedAt).toBe(json.captured_at);
    expect(paymentResponse.voidedAt).toBe(json.voided_at);
    expect(paymentResponse.description).toBe(json.description);
    expect(paymentResponse.amountFormat).toBe(json.amount_format);
    expect(paymentResponse.feeFormat).toBe(json.fee_format);
    expect(paymentResponse.refundedFormat).toBe(json.refunded_format);
    expect(paymentResponse.capturedFormat).toBe(json.captured_format);
    expect(paymentResponse.invoiceId).toBe(json.invoice_id);
    expect(paymentResponse.ip).toBe(json.ip);
    expect(paymentResponse.callbackUrl).toBe(json.callback_url);
    expect(paymentResponse.createdAt).toBe(json.created_at);
    expect(paymentResponse.updatedAt).toBe(json.updated_at);
    expect(paymentResponse.metadata).toEqual(json.metadata);

    expect((paymentResponse.source as CreditCardResponseSource).network).toBe(
      json.source.company
    );
    expect((paymentResponse.source as CreditCardResponseSource).name).toBe(
      json.source.name
    );
    expect((paymentResponse.source as CreditCardResponseSource).number).toBe(
      json.source.number
    );
    expect((paymentResponse.source as CreditCardResponseSource).gatewayId).toBe(
      json.source.gateway_id
    );
    expect(
      (paymentResponse.source as CreditCardResponseSource).transactionUrl
    ).toBe(json.source.transaction_url);
    expect(
      (paymentResponse.source as CreditCardResponseSource).referenceNumber
    ).toBe(json.source.reference_number);
    expect((paymentResponse.source as CreditCardResponseSource).token).toBe(
      json.source.token
    );
    expect((paymentResponse.source as CreditCardResponseSource).message).toBe(
      json.source.message
    );
  });

  it('should create a PaymentResponse instance from JSON with apple pay source with all params', () => {
    const json = {
      id: '123',
      status: 'paid',
      amount: 1000,
      fee: 50,
      currency: 'SAR',
      refunded: 0,
      captured: 1000,
      captured_at: '2023-01-01T00:00:00Z',
      voided_at: '2023-01-01T00:00:00Z',
      description: 'Payment for order #123',
      amount_format: '10.00',
      fee_format: '0.50',
      refunded_format: '0.00',
      captured_format: '10.00',
      invoice_id: '123',
      ip: '8.8.8.8',
      callback_url: 'https://example.com/callback',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      metadata: { orderId: '12345' },
      source: {
        number: '123456',
        gateway_id: '123',
        reference_number: '123',
        message: 'message123',
      },
    };

    const paymentResponse = PaymentResponse.fromJson(
      json,
      PaymentType.applePay
    );

    expect(paymentResponse.id).toBe(json.id);
    expect(paymentResponse.status).toBe(json.status);
    expect(paymentResponse.amount).toBe(json.amount);
    expect(paymentResponse.fee).toBe(json.fee);
    expect(paymentResponse.currency).toBe(json.currency);
    expect(paymentResponse.refunded).toBe(json.refunded);
    expect(paymentResponse.captured).toBe(json.captured);
    expect(paymentResponse.capturedAt).toBe(json.captured_at);
    expect(paymentResponse.voidedAt).toBe(json.voided_at);
    expect(paymentResponse.description).toBe(json.description);
    expect(paymentResponse.amountFormat).toBe(json.amount_format);
    expect(paymentResponse.feeFormat).toBe(json.fee_format);
    expect(paymentResponse.refundedFormat).toBe(json.refunded_format);
    expect(paymentResponse.capturedFormat).toBe(json.captured_format);
    expect(paymentResponse.invoiceId).toBe(json.invoice_id);
    expect(paymentResponse.ip).toBe(json.ip);
    expect(paymentResponse.callbackUrl).toBe(json.callback_url);
    expect(paymentResponse.createdAt).toBe(json.created_at);
    expect(paymentResponse.updatedAt).toBe(json.updated_at);
    expect(paymentResponse.metadata).toEqual(json.metadata);

    expect((paymentResponse.source as any).number).toBe(json.source.number);
    expect((paymentResponse.source as any).gatewayId).toBe(
      json.source.gateway_id
    );
    expect((paymentResponse.source as any).referenceNumber).toBe(
      json.source.reference_number
    );
    expect((paymentResponse.source as any).message).toBe(json.source.message);
  });

  it('should create a PaymentResponse instance from JSON with unknown source with all params', () => {
    const json = {
      id: '123',
      status: 'paid',
      amount: 10000,
      fee: 50,
      currency: 'SAR',
      refunded: 0,
      captured: 1000,
      captured_at: '2023-01-01T00:00:00Z',
      voided_at: '2023-01-01T00:00:00Z',
      description: 'Payment for order #123',
      amount_format: '10.00',
      fee_format: '0.50',
      refunded_format: '0.00',
      captured_format: '10.00',
      invoice_id: '123',
      ip: '8.8.8.8',
      callback_url: 'https://example.com/callback',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      metadata: { orderId: '12345' },
      source: {
        type: 'unknown',
        message: 'message123',
      },
    };

    const paymentResponse = PaymentResponse.fromJson(json, 'unknown' as any);

    expect(paymentResponse.id).toBe(json.id);
    expect(paymentResponse.status).toBe(json.status);
    expect(paymentResponse.amount).toBe(json.amount);
    expect(paymentResponse.fee).toBe(json.fee);
    expect(paymentResponse.currency).toBe(json.currency);
    expect(paymentResponse.refunded).toBe(json.refunded);
    expect(paymentResponse.captured).toBe(json.captured);
    expect(paymentResponse.capturedAt).toBe(json.captured_at);
    expect(paymentResponse.voidedAt).toBe(json.voided_at);
    expect(paymentResponse.description).toBe(json.description);
    expect(paymentResponse.amountFormat).toBe(json.amount_format);
    expect(paymentResponse.feeFormat).toBe(json.fee_format);
    expect(paymentResponse.refundedFormat).toBe(json.refunded_format);
    expect(paymentResponse.capturedFormat).toBe(json.captured_format);
    expect(paymentResponse.invoiceId).toBe(json.invoice_id);
    expect(paymentResponse.ip).toBe(json.ip);
    expect(paymentResponse.callbackUrl).toBe(json.callback_url);
    expect(paymentResponse.createdAt).toBe(json.created_at);
    expect(paymentResponse.updatedAt).toBe(json.updated_at);
    expect(paymentResponse.metadata).toEqual(json.metadata);

    expect((paymentResponse.source as any).type).toBe(json.source.type);
    expect((paymentResponse.source as any).message).toBe(json.source.message);
  });
});
