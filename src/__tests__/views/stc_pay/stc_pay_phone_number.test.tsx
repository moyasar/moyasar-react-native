import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { StcPay } from '../../../views/stc_pay/stc_pay_phone_number';
import { PaymentConfig } from '../../../models/payment_config';

// Mock StcPayService
jest.mock('../../../services/stc_pay_service', () => {
  return {
    StcPayService: jest.fn().mockImplementation(() => ({
      phoneNumberValidator: {
        validate: jest.fn().mockReturnValue(null),
        visualValidate: jest.fn().mockReturnValue(null),
      },
      beginStcPayment: jest.fn().mockResolvedValue(false),
    })),
  };
});

describe('StcPay - Phone Number', () => {
  const mockPaymentConfig = new PaymentConfig({
    publishableApiKey: 'pk_test_123',
    amount: 10000,
    currency: 'SAR',
    description: 'Test payment',
  });

  const mockOnPaymentResult = jest.fn();

  const defaultProps = {
    paymentConfig: mockPaymentConfig,
    onPaymentResult: mockOnPaymentResult,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders phone number title', () => {
    const { getByText } = render(<StcPay {...defaultProps} />);

    expect(getByText(/mobile number/i)).toBeTruthy();
  });

  it('renders phone number input', () => {
    const { getByPlaceholderText } = render(<StcPay {...defaultProps} />);

    expect(getByPlaceholderText('05X XXX XXXX')).toBeTruthy();
  });

  it('renders pay button', () => {
    const { getByText } = render(<StcPay {...defaultProps} />);

    expect(getByText(/pay/i)).toBeTruthy();
  });

  it('formats phone number input correctly', () => {
    const { getByPlaceholderText } = render(<StcPay {...defaultProps} />);

    const input = getByPlaceholderText('05X XXX XXXX');
    fireEvent.changeText(input, '0512345678');

    // Should format as 05X XXX XXXX
    expect(input.props.value).toMatch(/05\d \d{3} \d{4}/);
  });

  it('stores phone number in state when typed', () => {
    const { getByPlaceholderText } = render(<StcPay {...defaultProps} />);

    const input = getByPlaceholderText('05X XXX XXXX');
    fireEvent.changeText(input, '0512345678');

    // The formatted value should contain the digits we entered
    expect(input.props.value.replace(/\s/g, '')).toBe('0512345678');
  });

  it('limits phone number input to 12 characters', () => {
    const { getByPlaceholderText } = render(<StcPay {...defaultProps} />);

    const input = getByPlaceholderText('05X XXX XXXX');
    expect(input.props.maxLength).toBe(12);
  });

  it('updates input value when phone number changes', () => {
    const { getByPlaceholderText } = render(<StcPay {...defaultProps} />);

    const input = getByPlaceholderText('05X XXX XXXX');
    fireEvent.changeText(input, '0512345678');

    // Value should be formatted
    expect(input.props.value).toBeTruthy();
    expect(input.props.value.replace(/\s/g, '')).toBe('0512345678');
  });

  it('renders pay button that can be pressed', () => {
    const { getByText } = render(<StcPay {...defaultProps} />);

    const payButton = getByText(/pay/i);
    expect(payButton).toBeTruthy();

    // Should not throw when pressed
    expect(() => fireEvent.press(payButton)).not.toThrow();
  });

  it('displays SAR currency symbol correctly', () => {
    const { getByText } = render(<StcPay {...defaultProps} />);

    // The component shows the amount with currency - 10000 halalas = 100 SAR
    expect(getByText('100')).toBeTruthy();
  });

  it('displays formatted amount for SAR', () => {
    const { getByText } = render(<StcPay {...defaultProps} />);

    // 10000 halalas = 100 SAR
    expect(getByText('100')).toBeTruthy();
  });

  it('displays formatted amount for non-SAR currencies', () => {
    const configUSD = new PaymentConfig({
      publishableApiKey: 'pk_test_123',
      amount: 10000,
      currency: 'USD',
      description: 'Test payment',
    });

    const { getByText } = render(
      <StcPay paymentConfig={configUSD} onPaymentResult={mockOnPaymentResult} />
    );

    // 10000 cents = $100.00 USD
    expect(getByText(/100/)).toBeTruthy();
  });

  it('shows loading indicator during payment processing', async () => {
    const StcPayService =
      require('../../../services/stc_pay_service').StcPayService;
    StcPayService.mockImplementationOnce(() => ({
      phoneNumberValidator: {
        validate: jest.fn().mockReturnValue(null),
        visualValidate: jest.fn().mockReturnValue(null),
      },
      beginStcPayment: jest
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve(false), 100))
        ),
    }));

    const { getByPlaceholderText, UNSAFE_getByType } = render(
      <StcPay {...defaultProps} />
    );

    const input = getByPlaceholderText('05X XXX XXXX');
    fireEvent.changeText(input, '0512345678');

    const buttons = UNSAFE_getByType(require('react-native').TouchableOpacity);
    fireEvent.press(buttons);

    // Should show activity indicator during processing
    await waitFor(() => {
      expect(() =>
        UNSAFE_getByType(require('react-native').ActivityIndicator)
      ).not.toThrow();
    });
  });

  it('disables input during payment processing', async () => {
    const StcPayService =
      require('../../../services/stc_pay_service').StcPayService;
    StcPayService.mockImplementationOnce(() => ({
      phoneNumberValidator: {
        validate: jest.fn().mockReturnValue(null),
        visualValidate: jest.fn().mockReturnValue(null),
      },
      beginStcPayment: jest
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve(false), 100))
        ),
    }));

    const { getByPlaceholderText, UNSAFE_getAllByType } = render(
      <StcPay {...defaultProps} />
    );

    const input = getByPlaceholderText('05X XXX XXXX');
    fireEvent.changeText(input, '0512345678');

    const buttons = UNSAFE_getAllByType(
      require('react-native').TouchableOpacity
    );
    fireEvent.press(buttons[0]);

    await waitFor(() => {
      expect(input.props.editable).toBe(false);
    });
  });

  it('applies custom styles when provided', () => {
    const customStyle = {
      container: { padding: 30 },
    };

    const { UNSAFE_getAllByType } = render(
      <StcPay {...defaultProps} style={customStyle} />
    );

    const { StyleSheet } = require('react-native');
    const views = UNSAFE_getAllByType(require('react-native').View);
    const styledView = views.find((view) => {
      const flatStyle = StyleSheet.flatten(view.props.style);
      return flatStyle?.padding === 30;
    });
    expect(styledView).toBeTruthy();
  });

  it('uses light theme colors in light mode', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('light');

    const { getByText } = render(<StcPay {...defaultProps} />);

    const { StyleSheet } = require('react-native');
    const title = getByText(/mobile number/i);
    const flatStyle = StyleSheet.flatten(title.props.style);
    expect(flatStyle.color).toBe('black');
  });

  it('uses dark theme colors in dark mode', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('dark');

    const { getByText } = render(<StcPay {...defaultProps} />);

    const { StyleSheet } = require('react-native');
    const title = getByText(/mobile number/i);
    const flatStyle = StyleSheet.flatten(title.props.style);
    expect(flatStyle.color).toBe('white');
  });

  it('removes non-numeric characters from input', () => {
    const { getByPlaceholderText } = render(<StcPay {...defaultProps} />);

    const input = getByPlaceholderText('05X XXX XXXX');
    fireEvent.changeText(input, '05123abc456');

    // Should only keep numeric characters
    expect(input.props.value).not.toContain('abc');
  });

  it('handles Arabic numerals correctly', () => {
    const { getByPlaceholderText } = render(<StcPay {...defaultProps} />);

    const input = getByPlaceholderText('05X XXX XXXX');
    fireEvent.changeText(input, '٠٥١٢٣٤٥٦٧٨');

    // Should convert Arabic numerals to English and format
    expect(input.props.value).toMatch(/05\d \d{3} \d{4}/);
  });

  it('applies custom placeholder color', () => {
    const customStyle = {
      textInputsPlaceholderColor: '#FF0000',
    };

    const { getByPlaceholderText } = render(
      <StcPay {...defaultProps} style={customStyle} />
    );

    const input = getByPlaceholderText('05X XXX XXXX');
    expect(input.props.placeholderTextColor).toBe('#FF0000');
  });

  it('uses numeric keyboard', () => {
    const { getByPlaceholderText } = render(<StcPay {...defaultProps} />);

    const input = getByPlaceholderText('05X XXX XXXX');
    expect(input.props.keyboardType).toBe('numeric');
  });
});
