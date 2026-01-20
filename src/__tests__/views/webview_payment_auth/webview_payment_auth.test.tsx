import { render, waitFor, act } from '@testing-library/react-native';
import { WebviewPaymentAuth } from '../../../views/webview_payment_auth';

// Mock react-native-webview
jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return {
    WebView: (props: any) => {
      return <View testID="mock-webview" {...props} />;
    },
  };
});

describe('WebviewPaymentAuth', () => {
  const mockOnPaymentAuthResult = jest.fn();
  const defaultProps = {
    transactionUrl: 'https://moyasar.com/3ds',
    onWebviewPaymentAuthResult: mockOnPaymentAuthResult,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders WebView with correct transaction URL', () => {
    const { getByTestId } = render(<WebviewPaymentAuth {...defaultProps} />);

    const webview = getByTestId('mock-webview');
    expect(webview).toBeTruthy();
    expect(webview.props.source.uri).toBe('https://moyasar.com/3ds');
  });

  it('shows loading indicator initially', () => {
    const { UNSAFE_getByType } = render(
      <WebviewPaymentAuth {...defaultProps} />
    );

    expect(() =>
      UNSAFE_getByType(require('react-native').ActivityIndicator)
    ).not.toThrow();
  });

  it('hides loading indicator when progress reaches 50%', async () => {
    const { UNSAFE_queryByType, getByTestId } = render(
      <WebviewPaymentAuth {...defaultProps} />
    );

    // Trigger onLoadProgress wrapped in act to properly flush state updates
    const webview = getByTestId('mock-webview');
    await act(async () => {
      webview.props.onLoadProgress({ nativeEvent: { progress: 0.6 } });
    });

    await waitFor(() => {
      const activityIndicator = UNSAFE_queryByType(
        require('react-native').ActivityIndicator
      );
      expect(activityIndicator).toBeNull();
    });
  });

  it('uses default callback URL when not provided', () => {
    const { getByTestId } = render(<WebviewPaymentAuth {...defaultProps} />);

    const webview = getByTestId('mock-webview');
    expect(webview.props.onShouldStartLoadWithRequest).toBeDefined();
  });

  it('uses custom callback URL when provided', () => {
    const customCallbackUrl = 'https://sdk2.mysr.dev/callback';
    const { getByTestId } = render(
      <WebviewPaymentAuth {...defaultProps} callbackUrl={customCallbackUrl} />
    );
    const webview = getByTestId('mock-webview');
    const shouldStartLoad = webview.props.onShouldStartLoadWithRequest;

    // Simulate navigation to callback URL with payment result
    const callbackRequest = {
      url: 'https://sdk2.mysr.dev/return?id=payment123&status=paid&message=Success',
    };

    shouldStartLoad(callbackRequest);

    expect(webview).toBeTruthy();
    expect(mockOnPaymentAuthResult).toHaveBeenCalledWith({
      id: 'payment123',
      status: 'paid',
      message: 'Success',
    });
  });

  it('calls onWebviewPaymentAuthResult when callback URL is detected', () => {
    const { getByTestId } = render(<WebviewPaymentAuth {...defaultProps} />);

    const webview = getByTestId('mock-webview');
    const shouldStartLoad = webview.props.onShouldStartLoadWithRequest;

    // Simulate navigation to callback URL with payment result
    const callbackRequest = {
      url: 'https://sdk.moyasar.com/return?id=payment123&status=paid&message=Success',
    };

    const result = shouldStartLoad(callbackRequest);

    expect(result).toBe(false); // Should prevent navigation
    expect(mockOnPaymentAuthResult).toHaveBeenCalledWith({
      id: 'payment123',
      status: 'paid',
      message: 'Success',
    });
  });

  it('allows navigation for non-callback URLs', () => {
    const { getByTestId } = render(<WebviewPaymentAuth {...defaultProps} />);

    const webview = getByTestId('mock-webview');
    const shouldStartLoad = webview.props.onShouldStartLoadWithRequest;

    // Simulate navigation to different URL
    const otherRequest = {
      url: 'https://sdk2.moyasar.com/verify',
    };

    const result = shouldStartLoad(otherRequest);

    expect(result).toBe(true); // Should allow navigation
    expect(mockOnPaymentAuthResult).not.toHaveBeenCalled();
  });

  it('handles missing query parameters gracefully', () => {
    const { getByTestId } = render(<WebviewPaymentAuth {...defaultProps} />);

    const webview = getByTestId('mock-webview');
    const shouldStartLoad = webview.props.onShouldStartLoadWithRequest;

    // Simulate callback URL without all parameters
    const callbackRequest = {
      url: 'https://sdk.moyasar.com/return?id=payment123',
    };

    const result = shouldStartLoad(callbackRequest);

    expect(result).toBe(false);
    expect(mockOnPaymentAuthResult).toHaveBeenCalledWith({
      id: 'payment123',
      status: '',
      message: '',
    });
  });

  it('uses custom activity indicator color when provided', () => {
    const customStyle = {
      webviewActivityIndicatorColor: '#FF0000',
    };

    const { UNSAFE_getByType } = render(
      <WebviewPaymentAuth {...defaultProps} style={customStyle} />
    );

    const activityIndicator = UNSAFE_getByType(
      require('react-native').ActivityIndicator
    );
    expect(activityIndicator.props.color).toBe('#FF0000');
  });

  it('uses default activity indicator color when not provided', () => {
    const { UNSAFE_getByType } = render(
      <WebviewPaymentAuth {...defaultProps} />
    );

    const activityIndicator = UNSAFE_getByType(
      require('react-native').ActivityIndicator
    );
    expect(activityIndicator.props.color).toBe('#768DFF');
  });

  it('matches custom callback URL host correctly', () => {
    const customCallbackUrl = 'https://sdk2.moyasar.com/payment-return';
    const { getByTestId } = render(
      <WebviewPaymentAuth {...defaultProps} callbackUrl={customCallbackUrl} />
    );

    const webview = getByTestId('mock-webview');
    const shouldStartLoad = webview.props.onShouldStartLoadWithRequest;

    // Should match custom callback URL
    const callbackRequest = {
      url: 'https://sdk2.moyasar.com/payment-return?id=pay123&status=paid&message=OK',
    };

    const result = shouldStartLoad(callbackRequest);

    expect(result).toBe(false);
    expect(mockOnPaymentAuthResult).toHaveBeenCalledWith({
      id: 'pay123',
      status: 'paid',
      message: 'OK',
    });
  });

  it('renders KeyboardAvoidingView for iOS', () => {
    const { UNSAFE_getByType } = render(
      <WebviewPaymentAuth {...defaultProps} />
    );

    expect(() =>
      UNSAFE_getByType(require('react-native').KeyboardAvoidingView)
    ).not.toThrow();
  });
});
