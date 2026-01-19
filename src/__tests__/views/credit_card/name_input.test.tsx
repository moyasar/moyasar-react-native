import { render, fireEvent } from '@testing-library/react-native';
import { NameInput } from '../../../views/credit_card/components/name_input';
import { CreditCardThemeContext } from '../../../views/credit_card/theme_context';
import { mockThemeContext } from '../../__fixtures__/theme_context_fixture';

describe('NameInput', () => {
  it('renders with correct testID', () => {
    const mockRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <NameInput
          value=""
          error={null}
          isEmpty={true}
          onChangeText={jest.fn()}
          onSubmitEditing={jest.fn()}
          inputRef={mockRef}
          disabled={false}
        />
      </CreditCardThemeContext.Provider>
    );

    expect(getByTestId('moyasar-name-on-card-input')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const mockOnChange = jest.fn();
    const mockRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <NameInput
          value=""
          error={null}
          isEmpty={true}
          onChangeText={mockOnChange}
          onSubmitEditing={jest.fn()}
          inputRef={mockRef}
          disabled={false}
        />
      </CreditCardThemeContext.Provider>
    );

    const input = getByTestId('moyasar-name-on-card-input');
    fireEvent.changeText(input, 'John Doe');

    expect(mockOnChange).toHaveBeenCalledWith('John Doe');
  });

  it('displays error border when error is present', () => {
    const mockRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <NameInput
          value="J"
          error="Name is too short"
          isEmpty={false}
          onChangeText={jest.fn()}
          onSubmitEditing={jest.fn()}
          inputRef={mockRef}
          disabled={false}
        />
      </CreditCardThemeContext.Provider>
    );

    const input = getByTestId('moyasar-name-on-card-input');
    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          borderColor: mockThemeContext.themeColors.error,
        }),
      ])
    );
  });

  it('is disabled when disabled prop is true', () => {
    const mockRef = { current: null };
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <NameInput
          value=""
          error={null}
          isEmpty={true}
          onChangeText={jest.fn()}
          onSubmitEditing={jest.fn()}
          inputRef={mockRef}
          disabled={true}
        />
      </CreditCardThemeContext.Provider>
    );

    const input = getByTestId('moyasar-name-on-card-input');
    expect(input.props.editable).toBe(false);
  });
});
