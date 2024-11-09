import { PaymentResponse } from '../../models/api/api_responses/payment_response';
import { PaymentType } from '../../models/payment_type';

export const paymentResponseWithInitJsonFixture = {
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

export const paymentResponseWithInitFixture = PaymentResponse.fromJson(
  paymentResponseWithInitJsonFixture,
  PaymentType.creditCard
);

const jsonPaid = {
  ...paymentResponseWithInitJsonFixture,
  status: 'paid',
};

export const paymentResponseWithPaidFixture = PaymentResponse.fromJson(
  jsonPaid,
  PaymentType.creditCard
);
