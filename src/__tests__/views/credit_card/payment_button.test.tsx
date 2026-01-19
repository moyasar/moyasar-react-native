import { render, fireEvent } from '@testing-library/react-native';
import { PaymentButton } from '../../../views/credit_card/components/payment_button';
import { CreditCardThemeContext } from '../../../views/credit_card/theme_context';
import { mockThemeContext } from '../../__fixtures__/theme_context_fixture';

describe('PaymentButton', () => {
  it('renders with correct testID', () => {
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <PaymentButton
          disabled={false}
          loading={false}
          amount={10000}
          currency="USD"
          onPress={jest.fn()}
        />
      </CreditCardThemeContext.Provider>
    );

    expect(getByTestId('moyasar-pay-button')).toBeTruthy();
  });

  it('shows loading indicator when loading is true', () => {
    const { UNSAFE_getByType } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <PaymentButton
          disabled={false}
          loading={true}
          amount={10000}
          currency="USD"
          onPress={jest.fn()}
        />
      </CreditCardThemeContext.Provider>
    );

    expect(() =>
      UNSAFE_getByType(require('react-native').ActivityIndicator)
    ).not.toThrow();
  });

  it('displays formatted amount for non-SAR currencies', () => {
    const { getByText } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <PaymentButton
          disabled={false}
          loading={false}
          amount={10000}
          currency="USD"
          onPress={jest.fn()}
        />
      </CreditCardThemeContext.Provider>
    );

    expect(getByText(/Pay/)).toBeTruthy();
  });

  it('displays SAR symbol for SAR currency', () => {
    const { getByText } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <PaymentButton
          disabled={false}
          loading={false}
          amount={10000}
          currency="SAR"
          onPress={jest.fn()}
        />
      </CreditCardThemeContext.Provider>
    );

    expect(getByText('Pay')).toBeTruthy();
    expect(getByText('100')).toBeTruthy(); // 10000 halalas = 100 SAR
  });

  it('calls onPress when button is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <PaymentButton
          disabled={false}
          loading={false}
          amount={10000}
          currency="USD"
          onPress={mockOnPress}
        />
      </CreditCardThemeContext.Provider>
    );

    const button = getByTestId('moyasar-pay-button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <PaymentButton
          disabled={true}
          loading={false}
          amount={10000}
          currency="USD"
          onPress={mockOnPress}
        />
      </CreditCardThemeContext.Provider>
    );

    const button = getByTestId('moyasar-pay-button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('has reduced opacity when disabled', () => {
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <PaymentButton
          disabled={true}
          loading={false}
          amount={10000}
          currency="USD"
          onPress={jest.fn()}
        />
      </CreditCardThemeContext.Provider>
    );

    const { StyleSheet } = require('react-native');
    const button = getByTestId('moyasar-pay-button');
    const flatStyle = StyleSheet.flatten(button.props.style);
    expect(flatStyle.opacity).toBe(0.5);
  });
});
