import { StyleSheet, Platform } from 'react-native';
import { readexRegular } from '../../../helpers/fonts';
import { isArabicLang } from '../../../localizations/i18n';

export const nameInputStyles = StyleSheet.create({
  inputSubContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    direction: isArabicLang() ? 'rtl' : 'ltr',
  },

  // Standalone input for Name on Card
  inputStandalone: {
    width: '100%',
    fontSize: 16,
    direction: 'ltr',
    textAlign: isArabicLang() ? 'right' : 'left',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    ...readexRegular,
    // Added shadow to match the cardGroup
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
