import { createContext, useContext } from 'react';
import type { ThemeContextValue } from './types';

export const CreditCardThemeContext = createContext<ThemeContextValue | null>(
  null
);

export const useTheme = () => {
  const context = useContext(CreditCardThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within CreditCardThemeProvider');
  }
  return context;
};
