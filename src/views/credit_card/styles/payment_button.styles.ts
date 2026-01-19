import { StyleSheet, Platform } from 'react-native';
import { readexMedium } from '../../../helpers/fonts';
import { isArabicLang } from '../../../localizations/i18n';

export const paymentButtonStyles = StyleSheet.create({
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    height: 50,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: Platform.OS === 'ios' ? 26 : undefined,
    ...readexMedium,
  },

  inputSubContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    direction: isArabicLang() ? 'rtl' : 'ltr',
  },
});
