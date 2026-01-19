import { render } from '@testing-library/react-native';
import { ApplePay } from '../../../views/apple_pay';
import { Platform } from 'react-native';
import { PaymentConfig } from '../../../models/payment_config';
import { ApplePayConfig } from '../../../models/apple_pay_config';

// Mock Apple Pay native module
jest.mock('../../../react_native_apple_pay', () => ({
  ApplePayButton: (props: any) => {
    const { View, Text } = require('react-native');
    return (
      <View
        testID="apple-pay-button"
        buttonType={props.type}
        buttonStyle={props.style}
        height={props.height}
        width={props.width}
        cornerRadius={props.cornerRadius}
        onPress={props.onPress}
      >
        <Text>{props.type}</Text>
      </View>
    );
  },
  PaymentRequest: jest.fn().mockImplementation(() => ({
    show: jest.fn().mockResolvedValue({
      details: {
        paymentData: { token: 'mock-token' },
      },
      complete: jest.fn(),
    }),
  })),
}));

// Mock payment service
jest.mock('../../../services/payment_service', () => ({
  createPayment: jest.fn().mockResolvedValue({
    id: 'payment-123',
    status: 'paid',
  }),
}));

describe('ApplePay', () => {
  const mockPaymentConfig = new PaymentConfig({
    publishableApiKey: 'pk_test_123',
    amount: 10000,
    currency: 'SAR',
    description: 'Test payment',
    supportedNetworks: ['visa', 'mastercard'],
    merchantCountryCode: 'SA',
    applePay: new ApplePayConfig({
      merchantId: 'merchant.com.example',
      label: 'Test Merchant',
    }),
  });

  const mockOnPaymentResult = jest.fn();

  const defaultProps = {
    paymentConfig: mockPaymentConfig,
    onPaymentResult: mockOnPaymentResult,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render ApplePayButton on non-iOS platform', () => {
    Platform.OS = 'android';

    const { queryByTestId } = render(<ApplePay {...defaultProps} />);

    expect(queryByTestId('apple-pay-button')).toBeNull();
  });

  it('renders ApplePayButton on iOS with applePay config', () => {
    Platform.OS = 'ios';

    const { getByTestId } = render(<ApplePay {...defaultProps} />);

    expect(getByTestId('apple-pay-button')).toBeTruthy();
  });

  it('uses default button type when not specified', () => {
    Platform.OS = 'ios';

    const { getByTestId } = render(<ApplePay {...defaultProps} />);

    const button = getByTestId('apple-pay-button');
    expect(button.props.buttonType).toBe('inStore');
  });

  it('uses custom button type when specified', () => {
    Platform.OS = 'ios';

    const { getByTestId } = render(
      <ApplePay {...defaultProps} style={{ buttonType: 'buy' }} />
    );

    const button = getByTestId('apple-pay-button');
    expect(button.props.buttonType).toBe('buy');
  });

  it('uses default height when not specified', () => {
    Platform.OS = 'ios';

    const { getByTestId } = render(<ApplePay {...defaultProps} />);

    const button = getByTestId('apple-pay-button');
    expect(button.props.height).toBe(50);
  });

  it('uses default width when not specified', () => {
    Platform.OS = 'ios';

    const { getByTestId } = render(<ApplePay {...defaultProps} />);

    const button = getByTestId('apple-pay-button');
    expect(button.props.width).toBe('90%');
  });

  it('uses default corner radius when not specified', () => {
    Platform.OS = 'ios';

    const { getByTestId } = render(<ApplePay {...defaultProps} />);

    const button = getByTestId('apple-pay-button');
    expect(button.props.cornerRadius).toBe(11);
  });

  it('uses custom button style when specified', () => {
    Platform.OS = 'ios';

    const { getByTestId } = render(
      <ApplePay {...defaultProps} style={{ buttonStyle: 'white' }} />
    );

    const button = getByTestId('apple-pay-button');
    expect(button.props.buttonStyle).toBe('white');
  });

  it('uses custom height when specified', () => {
    Platform.OS = 'ios';

    const { getByTestId } = render(
      <ApplePay {...defaultProps} style={{ height: 60 }} />
    );

    const button = getByTestId('apple-pay-button');
    expect(button.props.height).toBe(60);
  });

  it('uses custom width when specified', () => {
    Platform.OS = 'ios';

    const { getByTestId } = render(
      <ApplePay {...defaultProps} style={{ width: '100%' }} />
    );

    const button = getByTestId('apple-pay-button');
    expect(button.props.width).toBe('100%');
  });

  it('uses custom corner radius when specified', () => {
    Platform.OS = 'ios';

    const { getByTestId } = render(
      <ApplePay {...defaultProps} style={{ cornerRadius: 20 }} />
    );

    const button = getByTestId('apple-pay-button');
    expect(button.props.cornerRadius).toBe(20);
  });

  it('uses black button style in light mode by default', () => {
    Platform.OS = 'ios';
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('light');

    const { getByTestId } = render(<ApplePay {...defaultProps} />);

    const button = getByTestId('apple-pay-button');
    expect(button.props.buttonStyle).toBe('black');
  });

  it('uses white button style in dark mode by default', () => {
    Platform.OS = 'ios';
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('dark');

    const { getByTestId } = render(<ApplePay {...defaultProps} />);

    const button = getByTestId('apple-pay-button');
    expect(button.props.buttonStyle).toBe('white');
  });

  it('centers the button in container', () => {
    Platform.OS = 'ios';

    const { UNSAFE_getAllByType } = render(<ApplePay {...defaultProps} />);

    const views = UNSAFE_getAllByType(require('react-native').View);
    const containerView = views.find(
      (view) => view.props.style?.alignItems === 'center'
    );
    expect(containerView).toBeTruthy();
  });

  it('uses all button types correctly', () => {
    Platform.OS = 'ios';

    const buttonTypes = ['plain', 'buy', 'inStore', 'donate', 'setUp'];

    buttonTypes.forEach((type) => {
      const { getByText } = render(
        <ApplePay {...defaultProps} style={{ buttonType: type }} />
      );

      expect(getByText(type)).toBeTruthy();
    });
  });

  it('handles payment config with all required fields', () => {
    Platform.OS = 'ios';

    const completeConfig: PaymentConfig = {
      ...mockPaymentConfig,
      applePay: {
        merchantId: 'merchant.com.example',
        label: 'Complete Merchant',
        manual: false,
        saveCard: false,
      },
    };

    const { getByTestId } = render(
      <ApplePay
        paymentConfig={completeConfig}
        onPaymentResult={mockOnPaymentResult}
      />
    );

    expect(getByTestId('apple-pay-button')).toBeTruthy();
  });
});
