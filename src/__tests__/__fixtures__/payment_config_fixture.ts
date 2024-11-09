import { ApplePayConfig } from '../../models/apple_pay_config';
import { CreditCardConfig } from '../../models/credit_card_config';
import { PaymentConfig } from '../../models/payment_config';

export const paymentConfigWithoutSaveOnlyFixture = new PaymentConfig({
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
  createSaveOnlyToken: false,
});

export const paymentConfigWithSaveOnlyFixture = new PaymentConfig({
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
