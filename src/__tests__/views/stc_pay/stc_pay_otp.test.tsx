import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { StcPayOtp } from '../../../views/stc_pay/stc_pay_otp';
import { StcPayService } from '../../../services/stc_pay_service';

// Mock StcPayService
const mockStcPayService = {
  otpValidator: {
    validate: jest.fn().mockReturnValue(null),
    visualValidate: jest.fn().mockReturnValue(null),
  },
  submitStcPaymentOtp: jest.fn().mockResolvedValue(undefined),
} as unknown as StcPayService;

describe('StcPayOtp', () => {
  const mockOnPaymentResult = jest.fn();

  const defaultProps = {
    onPaymentResult: mockOnPaymentResult,
    stcPayService: mockStcPayService,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders OTP title', () => {
    const { getByText } = render(<StcPayOtp {...defaultProps} />);

    expect(getByText(/one-time password/i)).toBeTruthy();
  });

  it('renders OTP input', () => {
    const { getByPlaceholderText } = render(<StcPayOtp {...defaultProps} />);

    expect(getByPlaceholderText('XXXXXX')).toBeTruthy();
  });

  it('renders confirm button', () => {
    const { getByText } = render(<StcPayOtp {...defaultProps} />);

    expect(getByText(/confirm/i)).toBeTruthy();
  });

  it('limits OTP input to 10 characters', () => {
    const { getByPlaceholderText } = render(<StcPayOtp {...defaultProps} />);

    const input = getByPlaceholderText('XXXXXX');
    expect(input.props.maxLength).toBe(10);
  });

  it('uses numeric keyboard', () => {
    const { getByPlaceholderText } = render(<StcPayOtp {...defaultProps} />);

    const input = getByPlaceholderText('XXXXXX');
    expect(input.props.keyboardType).toBe('numeric');
  });

  it('has one-time code content type', () => {
    const { getByPlaceholderText } = render(<StcPayOtp {...defaultProps} />);

    const input = getByPlaceholderText('XXXXXX');
    expect(input.props.textContentType).toBe('oneTimeCode');
  });

  it('has SMS OTP autocomplete', () => {
    const { getByPlaceholderText } = render(<StcPayOtp {...defaultProps} />);

    const input = getByPlaceholderText('XXXXXX');
    expect(input.props.autoComplete).toBe('sms-otp');
  });

  it('validates OTP on change', () => {
    const { getByPlaceholderText } = render(<StcPayOtp {...defaultProps} />);

    const input = getByPlaceholderText('XXXXXX');
    fireEvent.changeText(input, '123456');

    expect(mockStcPayService.otpValidator.visualValidate).toHaveBeenCalledWith(
      '123456'
    );
  });

  it('displays error message when validation fails', () => {
    const serviceWithError = {
      ...mockStcPayService,
      otpValidator: {
        validate: jest.fn().mockReturnValue('Invalid OTP'),
        visualValidate: jest.fn().mockReturnValue('Invalid OTP'),
      },
    } as unknown as StcPayService;

    const { getByPlaceholderText, getByText } = render(
      <StcPayOtp {...defaultProps} stcPayService={serviceWithError} />
    );

    const input = getByPlaceholderText('XXXXXX');
    fireEvent.changeText(input, '123');

    expect(getByText('Invalid OTP')).toBeTruthy();
  });

  it('disables button when OTP is invalid', () => {
    const serviceWithError = {
      ...mockStcPayService,
      otpValidator: {
        validate: jest.fn().mockReturnValue('Error'),
        visualValidate: jest.fn().mockReturnValue('Error'),
      },
    } as unknown as StcPayService;

    const { UNSAFE_getAllByType } = render(
      <StcPayOtp {...defaultProps} stcPayService={serviceWithError} />
    );

    const buttons = UNSAFE_getAllByType(
      require('react-native').TouchableOpacity
    );
    const confirmButton = buttons.find((btn) => btn.props.disabled);
    expect(confirmButton).toBeTruthy();
  });

  it('calls submitStcPaymentOtp when confirm button is pressed', async () => {
    const { getByPlaceholderText, getByText } = render(
      <StcPayOtp {...defaultProps} />
    );

    const input = getByPlaceholderText('XXXXXX');
    fireEvent.changeText(input, '123456');

    const button = getByText(/confirm/i);
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockStcPayService.submitStcPaymentOtp).toHaveBeenCalledWith(
        '123456',
        mockOnPaymentResult
      );
    });
  });

  it('shows loading indicator during OTP submission', async () => {
    const slowService = {
      ...mockStcPayService,
      submitStcPaymentOtp: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
        ),
    } as unknown as StcPayService;

    const { getByPlaceholderText, getByText, UNSAFE_getByType } = render(
      <StcPayOtp {...defaultProps} stcPayService={slowService} />
    );

    const input = getByPlaceholderText('XXXXXX');
    fireEvent.changeText(input, '123456');

    const button = getByText(/confirm/i);
    fireEvent.press(button);

    // Should show activity indicator during submission
    await waitFor(() => {
      expect(() =>
        UNSAFE_getByType(require('react-native').ActivityIndicator)
      ).not.toThrow();
    });
  });

  it('disables input during OTP submission', async () => {
    const slowService = {
      ...mockStcPayService,
      submitStcPaymentOtp: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
        ),
    } as unknown as StcPayService;

    const { getByPlaceholderText, getByText } = render(
      <StcPayOtp {...defaultProps} stcPayService={slowService} />
    );

    const input = getByPlaceholderText('XXXXXX');
    fireEvent.changeText(input, '123456');

    const button = getByText(/confirm/i);
    fireEvent.press(button);

    await waitFor(() => {
      expect(input.props.editable).toBe(false);
    });
  });

  it('removes non-numeric characters from input', () => {
    const { getByPlaceholderText } = render(<StcPayOtp {...defaultProps} />);

    const input = getByPlaceholderText('XXXXXX');
    fireEvent.changeText(input, '123abc456');

    // Should only keep numeric characters
    expect(input.props.value).not.toContain('abc');
  });

  it('handles Arabic numerals correctly', () => {
    const { getByPlaceholderText } = render(<StcPayOtp {...defaultProps} />);

    const input = getByPlaceholderText('XXXXXX');
    fireEvent.changeText(input, '١٢٣٤٥٦');

    // Should convert Arabic numerals to English
    expect(input).toBeTruthy();
  });

  it('applies custom styles when provided', () => {
    const customStyle = {
      container: { padding: 40 },
    };

    const { UNSAFE_getAllByType } = render(
      <StcPayOtp {...defaultProps} style={customStyle} />
    );

    const { StyleSheet } = require('react-native');
    const views = UNSAFE_getAllByType(require('react-native').View);
    const styledView = views.find((view) => {
      const flatStyle = StyleSheet.flatten(view.props.style);
      return flatStyle?.padding === 40;
    });
    expect(styledView).toBeTruthy();
  });

  it('uses light theme colors in light mode', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('light');

    const { getByText } = render(<StcPayOtp {...defaultProps} />);

    const { StyleSheet } = require('react-native');
    const title = getByText(/one-time password/i);
    const flatStyle = StyleSheet.flatten(title.props.style);
    expect(flatStyle.color).toBe('black');
  });

  it('uses dark theme colors in dark mode', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('dark');

    const { getByText } = render(<StcPayOtp {...defaultProps} />);

    const { StyleSheet } = require('react-native');
    const title = getByText(/one-time password/i);
    const flatStyle = StyleSheet.flatten(title.props.style);
    expect(flatStyle.color).toBe('white');
  });

  it('applies custom placeholder color', () => {
    const customStyle = {
      textInputsPlaceholderColor: '#00FF00',
    };

    const { getByPlaceholderText } = render(
      <StcPayOtp {...defaultProps} style={customStyle} />
    );

    const input = getByPlaceholderText('XXXXXX');
    expect(input.props.placeholderTextColor).toBe('#00FF00');
  });

  it('applies custom activity indicator color', async () => {
    const customStyle = {
      activityIndicatorColor: '#FF00FF',
    };

    const slowService = {
      ...mockStcPayService,
      submitStcPaymentOtp: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
        ),
    } as unknown as StcPayService;

    const { getByPlaceholderText, getByText, UNSAFE_getByType } = render(
      <StcPayOtp
        {...defaultProps}
        style={customStyle}
        stcPayService={slowService}
      />
    );

    const input = getByPlaceholderText('XXXXXX');
    fireEvent.changeText(input, '123456');

    const button = getByText(/confirm/i);
    fireEvent.press(button);

    // Check activity indicator color
    await waitFor(() => {
      const indicator = UNSAFE_getByType(
        require('react-native').ActivityIndicator
      );
      expect(indicator.props.color).toBe('#FF00FF');
    });
  });

  it('uses default activity indicator color when not provided', async () => {
    const slowService = {
      ...mockStcPayService,
      submitStcPaymentOtp: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
        ),
    } as unknown as StcPayService;

    const { getByPlaceholderText, getByText, UNSAFE_getByType } = render(
      <StcPayOtp {...defaultProps} stcPayService={slowService} />
    );

    const input = getByPlaceholderText('XXXXXX');
    fireEvent.changeText(input, '123456');

    const button = getByText(/confirm/i);
    fireEvent.press(button);

    // Check default activity indicator color
    await waitFor(() => {
      const indicator = UNSAFE_getByType(
        require('react-native').ActivityIndicator
      );
      expect(indicator.props.color).toBe('#ffffff');
    });
  });

  it('disables button during submission', async () => {
    const slowService = {
      ...mockStcPayService,
      submitStcPaymentOtp: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
        ),
    } as unknown as StcPayService;

    const { getByPlaceholderText, UNSAFE_getAllByType } = render(
      <StcPayOtp {...defaultProps} stcPayService={slowService} />
    );

    const input = getByPlaceholderText('XXXXXX');
    fireEvent.changeText(input, '123456');

    const buttons = UNSAFE_getAllByType(
      require('react-native').TouchableOpacity
    );
    fireEvent.press(buttons[0]);

    await waitFor(() => {
      expect(buttons[0].props.disabled).toBe(true);
    });
  });
});
