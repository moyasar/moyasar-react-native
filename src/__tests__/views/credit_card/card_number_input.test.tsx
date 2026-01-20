import { render, fireEvent } from '@testing-library/react-native';
import { CardNumberInput } from '../../../views/credit_card/components/card_number_input';
import { CreditCardThemeContext } from '../../../views/credit_card/theme_context';
import { mockThemeContext } from '../../__fixtures__/theme_context_fixture';
import { defaultNetworks } from '../../__fixtures__/credit_card_networks_fixture';

describe('CardNumberInput', () => {
  it('renders with correct testID', () => {
    const mockRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardNumberInput
          value=""
          onChangeText={jest.fn()}
          onSubmitEditing={jest.fn()}
          inputRef={mockRef}
          disabled={false}
          supportedNetworks={defaultNetworks}
        />
      </CreditCardThemeContext.Provider>
    );

    expect(getByTestId('moyasar-card-number-input')).toBeTruthy();
  });

  it('formats card number correctly', () => {
    const mockRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardNumberInput
          value="4111111111111111"
          onChangeText={jest.fn()}
          onSubmitEditing={jest.fn()}
          inputRef={mockRef}
          disabled={false}
          supportedNetworks={defaultNetworks}
        />
      </CreditCardThemeContext.Provider>
    );

    const input = getByTestId('moyasar-card-number-input');
    expect(input.props.value).toBe('4111 1111 1111 1111');
  });

  it('calls onChangeText when card number changes', () => {
    const mockOnChange = jest.fn();
    const mockRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardNumberInput
          value=""
          onChangeText={mockOnChange}
          onSubmitEditing={jest.fn()}
          inputRef={mockRef}
          disabled={false}
          supportedNetworks={defaultNetworks}
        />
      </CreditCardThemeContext.Provider>
    );

    const input = getByTestId('moyasar-card-number-input');
    fireEvent.changeText(input, '4111 1111 1111 1111');

    expect(mockOnChange).toHaveBeenCalledWith('4111111111111111');
  });

  it('shows Visa logo for Visa cards', () => {
    const mockRef = { current: null };
    const { UNSAFE_getByType } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardNumberInput
          value="4111111111111111"
          onChangeText={jest.fn()}
          onSubmitEditing={jest.fn()}
          inputRef={mockRef}
          disabled={false}
          supportedNetworks={defaultNetworks}
        />
      </CreditCardThemeContext.Provider>
    );

    // Visa logo should be rendered
    expect(() =>
      UNSAFE_getByType(require('../../../assets/visa').Visa)
    ).not.toThrow();
  });

  it('limits max length for Amex cards', () => {
    const mockRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardNumberInput
          value="378282246310005"
          onChangeText={jest.fn()}
          onSubmitEditing={jest.fn()}
          inputRef={mockRef}
          disabled={false}
          supportedNetworks={defaultNetworks}
        />
      </CreditCardThemeContext.Provider>
    );

    const input = getByTestId('moyasar-card-number-input');
    expect(input.props.maxLength).toBe(17); // Amex has 15 digits + 2 spaces = 17 chars
  });
});
