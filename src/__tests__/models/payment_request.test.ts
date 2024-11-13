import { ApplePayRequestSource } from '../../models/api/sources/apple_pay/apple_pay_request_source';
import { CreditCardRequestSource } from '../../models/api/sources/credit_card/credit_card_request_source';
import { PaymentRequest } from '../../models/api/api_requests/payment_request';

describe('PaymentRequest', () => {
  it('should create an instance of PaymentRequest with a CreditCardRequestSource with least params', () => {
    // TODO: Export the sources' tests to be separated
    const ccSource = new CreditCardRequestSource({
      name: 'John Doe',
      number: '4111111111111111',
      cvc: '123',
      month: '12',
      year: '2028',
    });

    expect(ccSource.name).toBe('John Doe');
    expect(ccSource.number).toBe('4111111111111111');
    expect(ccSource.cvc).toBe('123');
    expect(ccSource.month).toBe('12');
    expect(ccSource.year).toBe('2028');
    expect(ccSource.saveCard).toBe('false');
    expect(ccSource.manual).toBe('false');

    const paymentRequest = new PaymentRequest({
      amount: 1000,
      source: ccSource,
      callbackUrl: 'https://example.com/callback',
    });

    expect(paymentRequest.amount).toBe(1000);
    expect(paymentRequest.currency).toBe('SAR');
    expect(paymentRequest.description).toBeUndefined();
    expect(paymentRequest.metadata).toBeUndefined();

    expect(paymentRequest.source).toBe(ccSource);
    expect(paymentRequest.source).toMatchObject(ccSource);
    expect(paymentRequest.source).toEqual(ccSource);

    expect(paymentRequest.callbackUrl).toBe('https://example.com/callback');
  });

  it('should create an instance of PaymentRequest with a CreditCardRequestSource with all params', () => {
    const ccSource = new CreditCardRequestSource({
      name: 'John Doe',
      number: '4111111111111111',
      cvc: '123',
      month: '12',
      year: '2028',
      tokenizeCard: true,
      manualPayment: true,
    });

    expect(ccSource.name).toBe('John Doe');
    expect(ccSource.number).toBe('4111111111111111');
    expect(ccSource.cvc).toBe('123');
    expect(ccSource.month).toBe('12');
    expect(ccSource.year).toBe('2028');
    expect(ccSource.saveCard).toBe('true');
    expect(ccSource.manual).toBe('true');

    const paymentRequest = new PaymentRequest({
      amount: 1000,
      currency: 'USD',
      description: 'Test payment',
      metadata: { orderId: 12345 },
      source: ccSource,
      callbackUrl: 'https://example.com/callback',
    });

    expect(paymentRequest.amount).toBe(1000);
    expect(paymentRequest.currency).toBe('USD');
    expect(paymentRequest.description).toBe('Test payment');
    expect(paymentRequest.metadata?.orderId).toEqual(12345);

    expect(paymentRequest.source).toBe(ccSource);
    expect(paymentRequest.source).toMatchObject(ccSource);
    expect(paymentRequest.source).toEqual(ccSource);

    expect(paymentRequest.callbackUrl).toBe('https://example.com/callback');
  });

  it('should create an instance of PaymentRequest with an ApplePayRequestSource with all params', () => {
    const applePaySource = new ApplePayRequestSource({
      applePayToken: 'token',
      manualPayment: true,
    });

    expect(applePaySource.applePayToken).toBe('token');
    expect(applePaySource.manualPayment).toBe('true');

    const paymentRequest = new PaymentRequest({
      amount: 10000,
      currency: 'SAR',
      description: 'Test payment',
      metadata: { orderId: 12345 },
      source: applePaySource,
    });

    expect(paymentRequest.amount).toBe(10000);
    expect(paymentRequest.currency).toBe('SAR');
    expect(paymentRequest.description).toBe('Test payment');
    expect(paymentRequest.metadata?.orderId).toEqual(12345);

    expect(paymentRequest.source).toBe(applePaySource);
    expect(paymentRequest.source).toMatchObject(applePaySource);
    expect(paymentRequest.source).toEqual(applePaySource);
  });

  it('should convert PaymentRequest to json with CreditCardRequestSource', () => {
    const ccSource = new CreditCardRequestSource({
      name: 'John Doe',
      number: '4111111111111111',
      cvc: '123',
      month: '12',
      year: '2028',
    });

    const paymentRequest = new PaymentRequest({
      amount: 1000,
      currency: 'USD',
      description: 'Test payment',
      metadata: { orderId: 12345 },
      source: ccSource,
      callbackUrl: 'https://example.com/callback',
    });

    const json = paymentRequest.toJson();

    expect(json).toEqual({
      amount: 1000,
      currency: 'USD',
      description: 'Test payment',
      metadata: { orderId: 12345 },
      source: {
        type: 'creditcard',
        company: 'visa',
        name: 'John Doe',
        number: '4111111111111111',
        cvc: '123',
        month: '12',
        year: '2028',
        save_card: 'false',
        manual: 'false',
      },
      callback_url: 'https://example.com/callback',
    });
  });
});
