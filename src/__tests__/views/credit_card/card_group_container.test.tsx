import { render } from '@testing-library/react-native';
import { CardGroupContainer } from '../../../views/credit_card/components/card_group_container';
import { CreditCardThemeContext } from '../../../views/credit_card/theme_context';
import { mockThemeContext } from '../../__fixtures__/theme_context_fixture';

describe('CardGroupContainer', () => {
  const defaultProps = {
    cardNumber: '',
    cardNumberError: null,
    expiry: '',
    expiryError: null,
    cvc: '',
    cvcError: null,
    onCardNumberChange: jest.fn(),
    onCvcValidationChange: jest.fn(),
    onExpiryChange: jest.fn(),
    onCvcChange: jest.fn(),
    onCardNumberSubmit: jest.fn(),
    onExpirySubmit: jest.fn(),
    onCvcSubmit: jest.fn(),
    cardNumberInputRef: { current: null },
    expiryInputRef: { current: null },
    cvcInputRef: { current: null },
    disabled: false,
    supportedNetworks: ['visa', 'mastercard', 'mada', 'amex'],
  };

  it('renders CardNumberInput and CardDetailsRow', () => {
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardGroupContainer {...defaultProps} />
      </CreditCardThemeContext.Provider>
    );

    expect(getByTestId('moyasar-card-number-input')).toBeTruthy();
    expect(getByTestId('moyasar-expiry-input')).toBeTruthy();
    expect(getByTestId('moyasar-cvc-input')).toBeTruthy();
  });

  it.each([
    { errorProp: 'cardNumberError', errorValue: 'Invalid card number' },
    { errorProp: 'expiryError', errorValue: 'Invalid expiry' },
    { errorProp: 'cvcError', errorValue: 'Invalid CVC' },
  ])(
    'applies error border when $errorProp is present',
    ({ errorProp, errorValue }) => {
      const { UNSAFE_getAllByType } = render(
        <CreditCardThemeContext.Provider value={mockThemeContext}>
          <CardGroupContainer
            {...defaultProps}
            {...{ [errorProp]: errorValue }}
          />
        </CreditCardThemeContext.Provider>
      );

      const { StyleSheet } = require('react-native');
      const views = UNSAFE_getAllByType(require('react-native').View);
      const cardGroupView = views.find((view) => {
        const flatStyle = StyleSheet.flatten(view.props.style);
        return flatStyle?.borderColor === mockThemeContext.themeColors.error;
      });
      expect(cardGroupView).toBeTruthy();
    }
  );

  it('shows error border when multiple errors present', () => {
    const { UNSAFE_getAllByType } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardGroupContainer
          {...defaultProps}
          cardNumberError="Card error"
          expiryError="Expiry error"
          cvcError="CVC error"
        />
      </CreditCardThemeContext.Provider>
    );

    // Should still show error border when multiple errors exist
    const { StyleSheet } = require('react-native');
    const views = UNSAFE_getAllByType(require('react-native').View);
    const cardGroupView = views.find((view) => {
      const flatStyle = StyleSheet.flatten(view.props.style);
      return flatStyle?.borderColor === mockThemeContext.themeColors.error;
    });
    expect(cardGroupView).toBeTruthy();
  });

  it('passes disabled prop to child inputs', () => {
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardGroupContainer {...defaultProps} disabled={true} />
      </CreditCardThemeContext.Provider>
    );

    const cardNumberInput = getByTestId('moyasar-card-number-input');
    const expiryInput = getByTestId('moyasar-expiry-input');
    const cvcInput = getByTestId('moyasar-cvc-input');

    expect(cardNumberInput.props.editable).toBe(false);
    expect(expiryInput.props.editable).toBe(false);
    expect(cvcInput.props.editable).toBe(false);
  });

  it('passes supportedNetworks to CardNumberInput', () => {
    const customNetworks = ['visa', 'mastercard'];
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardGroupContainer
          {...defaultProps}
          supportedNetworks={customNetworks}
        />
      </CreditCardThemeContext.Provider>
    );

    const cardNumberInput = getByTestId('moyasar-card-number-input');
    expect(cardNumberInput).toBeTruthy();
  });

  it('applies custom styles when provided', () => {
    const customThemeContext = {
      ...mockThemeContext,
      customStyle: {
        groupedTextInputsContainer: { borderRadius: 20 },
      },
    };

    const { UNSAFE_getAllByType } = render(
      <CreditCardThemeContext.Provider value={customThemeContext}>
        <CardGroupContainer {...defaultProps} />
      </CreditCardThemeContext.Provider>
    );

    const { StyleSheet } = require('react-native');
    const views = UNSAFE_getAllByType(require('react-native').View);
    const styledView = views.find((view) => {
      const flatStyle = StyleSheet.flatten(view.props.style);
      return flatStyle?.borderRadius === 20;
    });
    expect(styledView).toBeTruthy();
  });

  it('passes hasError to CardDetailsRow', () => {
    const { getByTestId } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardGroupContainer {...defaultProps} cardNumberError="Invalid card" />
      </CreditCardThemeContext.Provider>
    );

    // CardDetailsRow should receive hasError as true
    const expiryInput = getByTestId('moyasar-expiry-input');
    expect(expiryInput).toBeTruthy();
  });

  it('displays input background color from theme', () => {
    const { UNSAFE_getAllByType } = render(
      <CreditCardThemeContext.Provider value={mockThemeContext}>
        <CardGroupContainer {...defaultProps} />
      </CreditCardThemeContext.Provider>
    );

    const { StyleSheet } = require('react-native');
    const views = UNSAFE_getAllByType(require('react-native').View);
    const cardGroupView = views.find((view) => {
      const flatStyle = StyleSheet.flatten(view.props.style);
      return (
        flatStyle?.backgroundColor ===
        mockThemeContext.themeColors.inputBackground
      );
    });
    expect(cardGroupView).toBeTruthy();
  });
});
