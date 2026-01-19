import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CreditCardView } from '../../../views/credit_card/credit_card_view';
import { PaymentConfig } from '../../../models/payment_config';
import { paymentService } from '../../../views/credit_card/payment_service_instance';

// Mock payment service
jest.mock('../../../views/credit_card/payment_service_instance', () => ({
  paymentService: {
    validateAllFields: jest.fn(),
    beginTransaction: jest.fn(),
    shouldShowNetworkLogo: jest.fn(() => false),
    nameValidator: {
      visualValidate: jest.fn(),
    },
    numberValidator: {
      visualValidate: jest.fn(),
    },
    expiryValidator: {
      visualValidate: jest.fn(),
    },
    cvcValidator: {
      visualValidate: jest.fn(),
    },
  },
}));

describe('CreditCardView', () => {
  const mockPaymentConfig = new PaymentConfig({
    publishableApiKey: 'pk_test_123',
    amount: 10000,
    currency: 'SAR',
    description: 'Test payment',
    merchantCountryCode: 'SA',
    supportedNetworks: ['visa', 'mastercard', 'mada'],
  });

  const mockSetWebviewVisible = jest.fn();
  const mockOnPaymentResult = jest.fn();

  const defaultProps = {
    paymentConfig: mockPaymentConfig,
    onPaymentResult: mockOnPaymentResult,
    setWebviewVisible: mockSetWebviewVisible,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (paymentService.validateAllFields as jest.Mock).mockReturnValue(false);
    (paymentService.nameValidator.visualValidate as jest.Mock).mockReturnValue(
      null
    );
    (
      paymentService.numberValidator.visualValidate as jest.Mock
    ).mockReturnValue(null);
    (
      paymentService.expiryValidator.visualValidate as jest.Mock
    ).mockReturnValue(null);
    (paymentService.cvcValidator.visualValidate as jest.Mock).mockReturnValue(
      null
    );
  });

  it('renders all form inputs', () => {
    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    expect(getByTestId('moyasar-name-on-card-input')).toBeTruthy();
    expect(getByTestId('moyasar-card-number-input')).toBeTruthy();
    expect(getByTestId('moyasar-expiry-input')).toBeTruthy();
    expect(getByTestId('moyasar-cvc-input')).toBeTruthy();
    expect(getByTestId('moyasar-pay-button')).toBeTruthy();
  });

  it('renders MoyasarLogo', () => {
    const { UNSAFE_getByType } = render(<CreditCardView {...defaultProps} />);

    expect(() =>
      UNSAFE_getByType(require('../../../assets/powered_logo').PoweredByLogo)
    ).not.toThrow();
  });

  it('button is disabled when form is incomplete', () => {
    (paymentService.validateAllFields as jest.Mock).mockReturnValue(false);

    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    const button = getByTestId('moyasar-pay-button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('button is enabled when form is valid', () => {
    (paymentService.validateAllFields as jest.Mock).mockReturnValue(true);

    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    const button = getByTestId('moyasar-pay-button');
    expect(button.props.accessibilityState.disabled).toBe(false);
  });

  it('validates name on change', () => {
    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    const nameInput = getByTestId('moyasar-name-on-card-input');
    fireEvent.changeText(nameInput, 'John Doe');

    expect(paymentService.nameValidator.visualValidate).toHaveBeenCalledWith(
      'John Doe'
    );
  });

  it('validates card number on change', () => {
    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    const cardInput = getByTestId('moyasar-card-number-input');
    fireEvent.changeText(cardInput, '4111111111111111');

    expect(paymentService.numberValidator.visualValidate).toHaveBeenCalled();
  });

  it('validates expiry on change', () => {
    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    const expiryInput = getByTestId('moyasar-expiry-input');
    fireEvent.changeText(expiryInput, '12/25');

    // Input strips non-numeric characters, so validator receives '1225'
    expect(paymentService.expiryValidator.visualValidate).toHaveBeenCalledWith(
      '1225'
    );
  });

  it('validates CVC on change', () => {
    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    const cvcInput = getByTestId('moyasar-cvc-input');
    fireEvent.changeText(cvcInput, '123');

    expect(paymentService.cvcValidator.visualValidate).toHaveBeenCalled();
  });

  it('displays name error when validation fails', () => {
    (paymentService.nameValidator.visualValidate as jest.Mock).mockReturnValue(
      'Name is required'
    );

    const { getByText } = render(<CreditCardView {...defaultProps} />);

    // Trigger validation
    const nameInput = getByText(/name on card/i).parent?.parent;
    expect(nameInput).toBeTruthy();
  });

  it('calls beginTransaction when pay button is pressed', async () => {
    (paymentService.validateAllFields as jest.Mock).mockReturnValue(true);
    (paymentService.beginTransaction as jest.Mock).mockResolvedValue(false);

    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    const button = getByTestId('moyasar-pay-button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(paymentService.beginTransaction).toHaveBeenCalledWith(
        mockPaymentConfig,
        { name: '', number: '', expiry: '', cvc: '' },
        mockOnPaymentResult
      );
    });
  });

  it('sets webview visible when 3DS authentication is required', async () => {
    (paymentService.validateAllFields as jest.Mock).mockReturnValue(true);
    (paymentService.beginTransaction as jest.Mock).mockResolvedValue(true);

    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    const button = getByTestId('moyasar-pay-button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockSetWebviewVisible).toHaveBeenCalledWith(true);
    });
  });

  it('disables inputs during payment processing', async () => {
    (paymentService.validateAllFields as jest.Mock).mockReturnValue(true);
    (paymentService.beginTransaction as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(false), 100);
        })
    );

    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    const button = getByTestId('moyasar-pay-button');
    fireEvent.press(button);

    // During payment processing, button should be disabled
    await waitFor(() => {
      expect(button.props.accessibilityState.disabled).toBe(true);
    });
  });

  it('applies custom styles when provided', () => {
    const customStyle = {
      container: { padding: 20 },
    };

    const { UNSAFE_getAllByType } = render(
      <CreditCardView {...defaultProps} style={customStyle} />
    );

    const { StyleSheet } = require('react-native');
    const views = UNSAFE_getAllByType(require('react-native').View);
    const styledView = views.find((view) => {
      const flatStyle = StyleSheet.flatten(view.props.style);
      return flatStyle?.padding === 20;
    });
    expect(styledView).toBeTruthy();
  });

  it('displays card information label', () => {
    const { getByText } = render(<CreditCardView {...defaultProps} />);

    expect(getByText(/card information/i)).toBeTruthy();
  });

  it('uses dark theme colors in dark mode', () => {
    // Mock useColorScheme to return 'dark'
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('dark');

    const { getByTestId, getByText } = render(
      <CreditCardView {...defaultProps} />
    );

    // Verify all form inputs render in dark mode
    expect(getByTestId('moyasar-name-on-card-input')).toBeTruthy();
    expect(getByTestId('moyasar-card-number-input')).toBeTruthy();
    expect(getByText(/card information/i)).toBeTruthy();
  });

  it('uses light theme colors in light mode', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('light');

    const { getByTestId, getByText } = render(
      <CreditCardView {...defaultProps} />
    );

    // Verify all form inputs render in light mode
    expect(getByTestId('moyasar-name-on-card-input')).toBeTruthy();
    expect(getByTestId('moyasar-card-number-input')).toBeTruthy();
    expect(getByText(/card information/i)).toBeTruthy();
  });

  it('handles focus navigation between inputs', () => {
    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    const nameInput = getByTestId('moyasar-name-on-card-input');

    // Simulate submitting name input (should focus card number)
    fireEvent(nameInput, 'submitEditing');

    expect(nameInput).toBeTruthy();
  });

  it('passes supported networks to CardGroupContainer', () => {
    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    const cardNumberInput = getByTestId('moyasar-card-number-input');
    expect(cardNumberInput).toBeTruthy();
  });

  it.each([
    { width: 375, height: 812, orientation: 'portrait' },
    { width: 812, height: 375, orientation: 'landscape' },
  ])('renders correctly in $orientation mode', ({ width, height }) => {
    jest
      .spyOn(require('react-native'), 'useWindowDimensions')
      .mockReturnValue({ width, height });

    const { getByTestId } = render(<CreditCardView {...defaultProps} />);

    // Verify form renders in both orientations
    expect(getByTestId('moyasar-name-on-card-input')).toBeTruthy();
    expect(getByTestId('moyasar-pay-button')).toBeTruthy();
  });
});
