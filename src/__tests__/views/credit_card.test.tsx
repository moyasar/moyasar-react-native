import { render, screen } from '@testing-library/react-native';
import { CreditCard } from '../../views/credit_card';
import { PaymentConfig } from '../../models/payment_config';

jest.mock('../../localizations/i18n', () => ({
  getCurrentLang: jest.fn(() => 'en'),
  isArabicLang: jest.fn(() => false),
  getConfiguredLocalizations: jest.fn(() => ({
    t: (key: string) => (key === 'moyasarTranslation:pay' ? 'Pay' : key),
  })),
}));

jest.mock('../../assets', () => ({
  Amex: () => null,
  Mada: () => null,
  Mastercard: () => null,
  PoweredByLogo: () => null,
  SaudiRiyal: () => null,
  UnionPay: () => null,
  Visa: () => null,
}));

jest.mock('../../views/webview_payment_auth', () => ({
  WebviewPaymentAuth: () => null,
}));

function makePaymentConfig(amount: number, currency: string): PaymentConfig {
  return new PaymentConfig({
    publishableApiKey: 'test_key',
    amount,
    currency,
    description: 'Test payment',
    supportedNetworks: ['mada', 'mastercard', 'visa'],
  });
}

describe('CreditCard pay button', () => {
  it('should update the displayed amount when the amount changes', () => {
    const onPaymentResult = jest.fn();

    render(
      <CreditCard
        paymentConfig={makePaymentConfig(1000, 'USD')}
        onPaymentResult={onPaymentResult}
      />
    );
    expect(screen.getByText('Pay $10.00')).toBeTruthy();

    screen.rerender(
      <CreditCard
        paymentConfig={makePaymentConfig(1500, 'USD')}
        onPaymentResult={onPaymentResult}
      />
    );
    expect(screen.getByText('Pay $15.00')).toBeTruthy();
  });

  it('should update the displayed amount when the currency changes', () => {
    const onPaymentResult = jest.fn();

    render(
      <CreditCard
        paymentConfig={makePaymentConfig(1000, 'USD')}
        onPaymentResult={onPaymentResult}
      />
    );
    expect(screen.getByText('Pay $10.00')).toBeTruthy();

    screen.rerender(
      <CreditCard
        paymentConfig={makePaymentConfig(1000, 'KWD')}
        onPaymentResult={onPaymentResult}
      />
    );
    expect(screen.getByText('Pay KWD 1.000')).toBeTruthy();
  });
});
