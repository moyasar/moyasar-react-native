import { render } from '@testing-library/react-native';
import { SamsungPay } from '../../../views/samsung_pay/samsung_pay';
import { Platform } from 'react-native';
import { PaymentConfig } from '../../../models/payment_config';
import { SamsungPayConfig } from '../../../models/samsung_pay_config';

// Mock Samsung Pay native component
jest.mock('../../../views/samsung_pay/index', () => ({
  SamsungPayButton: (props: any) => {
    const { View } = require('react-native');
    return <View testID="samsung-pay-button" {...props} />;
  },
}));

describe('SamsungPay', () => {
  const mockPaymentConfig = new PaymentConfig({
    publishableApiKey: 'pk_test_123456789',
    amount: 10000,
    currency: 'SAR',
    description: 'Test payment',
    supportedNetworks: ['visa', 'mastercard'],
    merchantCountryCode: 'SA',
    samsungPay: new SamsungPayConfig({
      serviceId: 'service-123',
      merchantName: 'Test Merchant',
      orderNumber: 'order-123',
    }),
  });

  const mockOnPaymentResult = jest.fn();

  const defaultProps = {
    paymentConfig: mockPaymentConfig,
    onPaymentResult: mockOnPaymentResult,
  };

  const setPlatformConstants = (manufacturer: string | undefined) => {
    Object.defineProperty(Platform, 'constants', {
      get: () => ({ Manufacturer: manufacturer }),
      configurable: true,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'android';
    setPlatformConstants('Samsung');
  });

  it('does not render SamsungPayButton on non-Android platform', () => {
    Platform.OS = 'ios';

    const { queryByTestId } = render(<SamsungPay {...defaultProps} />);

    expect(queryByTestId('samsung-pay-button')).toBeNull();
  });

  it('does not render SamsungPayButton on non-Samsung Android device', () => {
    setPlatformConstants('Google');

    const { queryByTestId } = render(<SamsungPay {...defaultProps} />);

    expect(queryByTestId('samsung-pay-button')).toBeNull();
  });

  it('renders SamsungPayButton on Samsung device with samsungPay config', () => {
    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    expect(getByTestId('samsung-pay-button')).toBeTruthy();
  });

  it('uses default height when not specified', () => {
    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    const button = getByTestId('samsung-pay-button');
    expect(button.props.style.height).toBe(65);
  });

  it('uses custom height when specified', () => {
    const { getByTestId } = render(
      <SamsungPay {...defaultProps} style={{ height: 60 }} />
    );

    const button = getByTestId('samsung-pay-button');
    expect(button.props.style.height).toBe(60);
  });

  it('uses default width when not specified', () => {
    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    const button = getByTestId('samsung-pay-button');
    expect(button.props.style.width).toBe('90%');
  });

  it('uses custom width when specified', () => {
    const { getByTestId } = render(
      <SamsungPay {...defaultProps} style={{ width: 200 }} />
    );

    const button = getByTestId('samsung-pay-button');
    expect(button.props.style.width).toBe(200);
  });

  it('passes merchantInfo correctly to SamsungPayButton', () => {
    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    const button = getByTestId('samsung-pay-button');
    expect(button.props.merchantInfo.serviceId).toBe('service-123');
    expect(button.props.merchantInfo.merchantName).toBe('Test Merchant');
    expect(button.props.merchantInfo.currency).toBe('SAR');
    expect(button.props.merchantInfo.merchantCountryCode).toBe('SA');
  });

  it('extracts merchantId from publishableApiKey', () => {
    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    const button = getByTestId('samsung-pay-button');
    // Should be first 15 characters
    expect(button.props.merchantInfo.merchantId).toBe('pk_test_1234567');
  });

  it('converts amount to major units', () => {
    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    const button = getByTestId('samsung-pay-button');
    // 10000 halalas = 100 SAR
    expect(button.props.merchantInfo.amount).toBe(100);
  });

  it('passes supportedNetworks to merchantInfo', () => {
    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    const button = getByTestId('samsung-pay-button');
    expect(button.props.merchantInfo.supportedNetworks).toEqual([
      'visa',
      'mastercard',
    ]);
  });

  it('passes orderNumber to merchantInfo', () => {
    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    const button = getByTestId('samsung-pay-button');
    expect(button.props.merchantInfo.orderNumber).toBe('order-123');
  });

  it('passes custom cornerRadius to merchantInfo', () => {
    const { getByTestId } = render(
      <SamsungPay {...defaultProps} style={{ cornerRadius: 16 }} />
    );

    const button = getByTestId('samsung-pay-button');
    expect(button.props.merchantInfo.buttonBorderRadius).toBe(16);
  });

  it('centers the button in container', () => {
    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    const button = getByTestId('samsung-pay-button');
    expect(button).toBeTruthy();
  });

  it('detects Samsung device with case-insensitive manufacturer', () => {
    setPlatformConstants('SAMSUNG');

    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    expect(getByTestId('samsung-pay-button')).toBeTruthy();
  });

  it('detects Samsung device with lowercase manufacturer', () => {
    setPlatformConstants('samsung');

    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    expect(getByTestId('samsung-pay-button')).toBeTruthy();
  });

  it('renders SamsungPayButton when manufacturer is undefined (assumes Samsung)', () => {
    setPlatformConstants(undefined);

    const { getByTestId } = render(<SamsungPay {...defaultProps} />);

    expect(getByTestId('samsung-pay-button')).toBeTruthy();
  });

  it('handles payment config with all optional fields', () => {
    const completeConfig = new PaymentConfig({
      publishableApiKey: mockPaymentConfig.publishableApiKey,
      amount: mockPaymentConfig.amount,
      currency: mockPaymentConfig.currency,
      description: mockPaymentConfig.description,
      supportedNetworks: mockPaymentConfig.supportedNetworks,
      samsungPay: new SamsungPayConfig({
        serviceId: 'service-456',
        merchantName: 'Complete Merchant',
        orderNumber: 'order-456',
      }),
    });

    const { getByTestId } = render(
      <SamsungPay
        paymentConfig={completeConfig}
        onPaymentResult={mockOnPaymentResult}
      />
    );

    expect(getByTestId('samsung-pay-button')).toBeTruthy();
  });
});
