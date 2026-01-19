import type { ThemeContextValue } from '../../views/credit_card/types';

/**
 * Shared mock theme context for credit card component tests.
 * This matches the default light theme colors used by the SDK.
 */
export const mockThemeContext: ThemeContextValue = {
  themeColors: {
    background: 'white',
    text: '#191502',
    placeholder: '#9E9E9E',
    border: '#E0E0E0',
    error: '#F62323',
    buttonBackground: '#768DFF',
    buttonText: 'white',
    required: '#F62323',
    inputBackground: 'white',
  },
  customStyle: undefined,
};

/**
 * Dark theme context for testing dark mode.
 */
export const mockDarkThemeContext: ThemeContextValue = {
  themeColors: {
    background: 'black',
    text: 'white',
    placeholder: '#666666',
    border: '#333333',
    error: '#FF6B6B',
    buttonBackground: '#768DFF',
    buttonText: 'white',
    required: '#FF6B6B',
    inputBackground: '#1A1A1A',
  },
  customStyle: undefined,
};
