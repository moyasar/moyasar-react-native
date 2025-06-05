import { PaymentConfig } from '../../models/payment_config';
import { CreditCardConfig } from '../../models/credit_card_config';
import { ApplePayConfig } from '../../models/apple_pay_config';

describe('PaymentConfig', () => {
  it('should create an instance with least valid parameters', () => {
    const config = new PaymentConfig({
      publishableApiKey: 'test_key',
      amount: 1000,
      description: 'Test payment',
    });

    expect(config.publishableApiKey).toBe('test_key');
    expect(config.amount).toBe(1000);
    expect(config.currency).toBe('SAR');
    expect(config.description).toBe('Test payment');
    expect(config.metadata).toBeUndefined();
    expect(config.supportedNetworks).toEqual([
      'mada',
      'visa',
      'mastercard',
      'amex',
    ]);
    expect(config.applePay).toBeUndefined();
    expect(config.creditCard).toBeInstanceOf(CreditCardConfig);
    expect(config.createSaveOnlyToken).toBe(false);
  });

  it('should create an instance with modified currency', () => {
    const config = new PaymentConfig({
      publishableApiKey: 'test_key',
      amount: 1000,
      currency: 'USD',
      description: 'Test payment',
    });

    expect(config.currency).toBe('USD');
  });

  it('should create an instance with all valid parameters', () => {
    const config = new PaymentConfig({
      givenId: '123e4567-e89b-12d3-a456-426614174000',
      publishableApiKey: 'test_key',
      amount: 1000,
      currency: 'SAR',
      description: 'Test payment',
      metadata: {
        size: 'xl',
        oversize: true,
        length: 42,
      },
      supportedNetworks: ['mada', 'mastercard', 'visa'],
      applePay: new ApplePayConfig({
        merchantId: 'com.example.merchant',
        label: 'Example Merchant',
        manual: true,
      }),
      creditCard: new CreditCardConfig({
        saveCard: true,
        manual: true,
      }),
      createSaveOnlyToken: true,
    });

    expect(config.givenId).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(config.publishableApiKey).toBe('test_key');
    expect(config.amount).toBe(1000);
    expect(config.currency).toBe('SAR');
    expect(config.description).toBe('Test payment');

    expect(config.metadata?.size).toBe('xl');
    expect(config.metadata?.oversize).toBe(true);
    expect(config.metadata?.length).toBe(42);

    expect(config.supportedNetworks).toEqual(['mada', 'mastercard', 'visa']);

    expect(config.applePay?.merchantId).toBe('com.example.merchant');
    expect(config.applePay?.label).toBe('Example Merchant');
    expect(config.applePay?.manual).toBe(true);

    expect(config.creditCard.saveCard).toBe(true);
    expect(config.creditCard.manual).toBe(true);

    expect(config.createSaveOnlyToken).toBe(true);
  });

  it('should throw an error if publishableApiKey is empty', () => {
    expect(() => {
      new PaymentConfig({
        publishableApiKey: '',
        amount: 1000,
        description: 'Test payment',
      });
    }).toThrow('Please fill `publishableApiKey` argument with your key.');
  });

  it('should throw an error if amount is not an integer', () => {
    expect(() => {
      new PaymentConfig({
        publishableApiKey: 'test_key',
        amount: 1000.5,
        description: 'Test payment',
      });
    }).toThrow('Amount must be an integer.');
  });

  it('should throw an error if amount is not positive', () => {
    expect(() => {
      new PaymentConfig({
        publishableApiKey: 'test_key',
        amount: -1000,
        description: 'Test payment',
      });
    }).toThrow('Amount must be a positive integer.');
  });

  it('should throw an error if description is empty', () => {
    expect(() => {
      new PaymentConfig({
        publishableApiKey: 'test_key',
        amount: 1000,
        description: '',
      });
    }).toThrow('Please add a description.');
  });

  it('should throw an error if supportedNetworks is empty', () => {
    expect(() => {
      new PaymentConfig({
        publishableApiKey: 'test_key',
        amount: 1000,
        description: 'Test payment',
        supportedNetworks: [],
      });
    }).toThrow('At least 1 network must be supported.');
  });

  it('should convert supportedNetworks to lowercase', () => {
    const config = new PaymentConfig({
      publishableApiKey: 'test_key',
      amount: 1000,
      description: 'Test payment',
      supportedNetworks: ['VISA', 'MASTERcard'],
    });

    expect(config.supportedNetworks).toEqual(['visa', 'mastercard']);
  });
});
