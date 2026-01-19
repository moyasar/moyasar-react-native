import { render, fireEvent } from '@testing-library/react-native';
import { CardDetailsRow } from '../../../views/credit_card/components/card_details_row';
import { CreditCardThemeContext } from '../../../views/credit_card/theme_context';
import { mockThemeContext } from '../../__fixtures__/theme_context_fixture';

describe('CardDetailsRow', () => {
  it('renders expiry and CVC inputs with correct testIDs', () => {
    const mockExpiryRef = { current: null };
    const mockCvcRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardDetailsRow
          expiry=""
          cvc=""
          cardNumber=""
          onExpiryChange={jest.fn()}
          onCvcChange={jest.fn()}
          onExpirySubmit={jest.fn()}
          onCvcSubmit={jest.fn()}
          expiryInputRef={mockExpiryRef}
          cvcInputRef={mockCvcRef}
          disabled={false}
          hasError={false}
        />
      </CreditCardThemeContext.Provider>
    );

    expect(getByTestId('moyasar-expiry-input')).toBeTruthy();
    expect(getByTestId('moyasar-cvc-input')).toBeTruthy();
  });

  it('formats expiry date correctly', () => {
    const mockExpiryRef = { current: null };
    const mockCvcRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardDetailsRow
          expiry="1225"
          cvc=""
          cardNumber=""
          onExpiryChange={jest.fn()}
          onCvcChange={jest.fn()}
          onExpirySubmit={jest.fn()}
          onCvcSubmit={jest.fn()}
          expiryInputRef={mockExpiryRef}
          cvcInputRef={mockCvcRef}
          disabled={false}
          hasError={false}
        />
      </CreditCardThemeContext.Provider>
    );

    const expiryInput = getByTestId('moyasar-expiry-input');
    expect(expiryInput.props.value).toBe('12 / 25');
  });

  it('calls onExpiryChange when expiry changes', () => {
    const mockOnExpiryChange = jest.fn();
    const mockExpiryRef = { current: null };
    const mockCvcRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardDetailsRow
          expiry=""
          cvc=""
          cardNumber=""
          onExpiryChange={mockOnExpiryChange}
          onCvcChange={jest.fn()}
          onExpirySubmit={jest.fn()}
          onCvcSubmit={jest.fn()}
          expiryInputRef={mockExpiryRef}
          cvcInputRef={mockCvcRef}
          disabled={false}
          hasError={false}
        />
      </CreditCardThemeContext.Provider>
    );

    const expiryInput = getByTestId('moyasar-expiry-input');
    fireEvent.changeText(expiryInput, '12 / 25');

    expect(mockOnExpiryChange).toHaveBeenCalled();
  });

  it('calls onCvcChange when CVC changes', () => {
    const mockOnCvcChange = jest.fn();
    const mockExpiryRef = { current: null };
    const mockCvcRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardDetailsRow
          expiry=""
          cvc=""
          cardNumber=""
          onExpiryChange={jest.fn()}
          onCvcChange={mockOnCvcChange}
          onExpirySubmit={jest.fn()}
          onCvcSubmit={jest.fn()}
          expiryInputRef={mockExpiryRef}
          cvcInputRef={mockCvcRef}
          disabled={false}
          hasError={false}
        />
      </CreditCardThemeContext.Provider>
    );

    const cvcInput = getByTestId('moyasar-cvc-input');
    fireEvent.changeText(cvcInput, '123');

    expect(mockOnCvcChange).toHaveBeenCalled();
  });

  it('sets CVC max length to 4 for Amex cards', () => {
    const mockExpiryRef = { current: null };
    const mockCvcRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardDetailsRow
          expiry=""
          cvc=""
          cardNumber="378282246310005"
          onExpiryChange={jest.fn()}
          onCvcChange={jest.fn()}
          onExpirySubmit={jest.fn()}
          onCvcSubmit={jest.fn()}
          expiryInputRef={mockExpiryRef}
          cvcInputRef={mockCvcRef}
          disabled={false}
          hasError={false}
        />
      </CreditCardThemeContext.Provider>
    );

    const cvcInput = getByTestId('moyasar-cvc-input');
    expect(cvcInput.props.maxLength).toBe(4);
  });

  it('sets CVC max length to 3 for non-Amex cards', () => {
    const mockExpiryRef = { current: null };
    const mockCvcRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardDetailsRow
          expiry=""
          cvc=""
          cardNumber="4111111111111111"
          onExpiryChange={jest.fn()}
          onCvcChange={jest.fn()}
          onExpirySubmit={jest.fn()}
          onCvcSubmit={jest.fn()}
          expiryInputRef={mockExpiryRef}
          cvcInputRef={mockCvcRef}
          disabled={false}
          hasError={false}
        />
      </CreditCardThemeContext.Provider>
    );

    const cvcInput = getByTestId('moyasar-cvc-input');
    expect(cvcInput.props.maxLength).toBe(3);
  });
});
