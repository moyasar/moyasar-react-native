import { TokenRequest } from '../../models/api/api_requests/token_request';

describe('TokenRequest', () => {
  it('should create an instance of TokenRequest with least params', () => {
    const tokenRequest = new TokenRequest({
      name: 'John Doe',
      number: '4111111111111111',
      cvc: '123',
      month: '12',
      year: '28',
      callbackUrl: 'https://sdk.moyasar.com/return',
    });

    expect(tokenRequest.name).toBe('John Doe');
    expect(tokenRequest.number).toBe('4111111111111111');
    expect(tokenRequest.cvc).toBe('123');
    expect(tokenRequest.month).toBe('12');
    expect(tokenRequest.year).toBe('28');
    expect(tokenRequest.callbackUrl).toBe('https://sdk.moyasar.com/return');
    expect(tokenRequest.metadata).toBe(undefined);
  });

  it('should create an instance of TokenRequest with all params', () => {
    const tokenRequest = new TokenRequest({
      name: 'John Doe',
      number: '4111111111111111',
      cvc: '123',
      month: '12',
      year: '2028',
      callbackUrl: 'https://sdk.moyasar.com/return',
      metadata: { orderId: '12345' },
    });

    expect(tokenRequest.name).toBe('John Doe');
    expect(tokenRequest.number).toBe('4111111111111111');
    expect(tokenRequest.cvc).toBe('123');
    expect(tokenRequest.month).toBe('12');
    expect(tokenRequest.year).toBe('2028');
    expect(tokenRequest.callbackUrl).toBe('https://sdk.moyasar.com/return');
    expect(tokenRequest.metadata?.orderId).toEqual('12345');
  });

  it('should convert TokenRequest instance to JSON correctly', () => {
    const tokenRequest = new TokenRequest({
      name: 'John Doe',
      number: '4111111111111111',
      cvc: '123',
      month: '12',
      year: '2028',
      callbackUrl: 'https://sdk.moyasar.com/return',
      metadata: { orderId: '12345' },
    });

    const json = tokenRequest.toJson();

    expect(json).toEqual({
      name: 'John Doe',
      number: '4111111111111111',
      cvc: '123',
      month: '12',
      year: '2028',
      save_only: true,
      callback_url: 'https://sdk.moyasar.com/return',
      metadata: { orderId: '12345' },
    });
  });
});
