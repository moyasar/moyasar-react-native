import { render, screen } from '@testing-library/react-native';
import { StcPay } from '../../views/stc_pay/stc_pay_phone_number';
import { PaymentConfig } from '../../models/payment_config';

jest.mock('../../localizations/i18n', () => ({
  getCurrentLang: jest.fn(() => 'en'),
  isArabicLang: jest.fn(() => false),
  getConfiguredLocalizations: jest.fn(() => ({
    t: (key: string) => (key === 'moyasarTranslation:pay' ? 'Pay' : key),
  })),
}));

jest.mock('../../assets/saudi_riyal', () => ({
  SaudiRiyal: () => null,
}));

function makePaymentConfig(amount: number, currency: string): PaymentConfig {
  return new PaymentConfig({
    publishableApiKey: 'test_key',
    amount,
    currency,
    description: 'Test payment',
  });
}

describe('StcPay pay button', () => {
  it('should update the displayed amount when the amount changes', () => {
    const onPaymentResult = jest.fn();

    render(
      <StcPay
        paymentConfig={makePaymentConfig(1000, 'USD')}
        onPaymentResult={onPaymentResult}
      />
    );
    expect(screen.getByText('Pay $10.00')).toBeTruthy();

    screen.rerender(
      <StcPay
        paymentConfig={makePaymentConfig(1500, 'USD')}
        onPaymentResult={onPaymentResult}
      />
    );
    expect(screen.getByText('Pay $15.00')).toBeTruthy();
  });
});
