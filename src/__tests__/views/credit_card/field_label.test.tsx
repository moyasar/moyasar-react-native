import { render } from '@testing-library/react-native';
import { FieldLabel } from '../../../views/credit_card/components/field_label';
import { CreditCardThemeContext } from '../../../views/credit_card/theme_context';
import { mockThemeContext } from '../../__fixtures__/theme_context_fixture';

describe('FieldLabel', () => {
  it('renders label text correctly in normal state', () => {
    const { getByText } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <FieldLabel labelText="Card Number" errorText={null} isEmpty={false} />
      </CreditCardThemeContext.Provider>
    );

    expect(getByText('Card Number')).toBeTruthy();
  });

  it('shows REQUIRED text when isEmpty is true', () => {
    const { getByText } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <FieldLabel labelText="Card Number" errorText={null} isEmpty={true} />
      </CreditCardThemeContext.Provider>
    );

    expect(getByText('REQUIRED')).toBeTruthy();
  });

  it('shows error text when errorText is provided', () => {
    const { getByText, queryByText } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <FieldLabel
          labelText="Card Number"
          errorText="Invalid card number"
          isEmpty={false}
        />
      </CreditCardThemeContext.Provider>
    );

    expect(getByText('Invalid card number')).toBeTruthy();
    expect(queryByText('Card Number')).toBeNull();
  });

  it('does not show REQUIRED text when error is present', () => {
    const { queryByText } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <FieldLabel
          labelText="Card Number"
          errorText="Invalid card number"
          isEmpty={true}
        />
      </CreditCardThemeContext.Provider>
    );

    expect(queryByText('REQUIRED')).toBeNull();
  });
});
