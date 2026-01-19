import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { CreditCardThemeContext } from '../../../views/credit_card/theme_context';
import { mockThemeContext } from '../__fixtures__/theme_context_fixture';

/**
 * Custom render function that wraps components with CreditCardThemeContext.
 * Use this for testing credit card components that require theme context.
 *
 * @example
 * const { getByTestId } = renderWithCreditCardTheme(<PaymentButton {...props} />);
 */
export function renderWithCreditCardTheme(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <CreditCardThemeContext.Provider value={mockThemeContext}>
      {children}
    </CreditCardThemeContext.Provider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}
