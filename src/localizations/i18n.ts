import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

const resources = {
  en: {
    translation: {
      nameOnCard: 'Name on Card',
      cardNumber: 'Card Number',
      expiry: 'Expiry',
      cvc: 'CVC',
      cardNumberRequired: 'Card number is required',
      invalidCardNumber: 'Invalid card number',
      unsupportedCreditCardNetwork: 'Unsupported card network',
      expiryRequired: 'Expiry date is required',
      invalidExpiry: 'Invalid expiry date',
      expiredCard: 'Expired card',
      nameRequired: 'Name is required',
      bothNamesRequired: 'Both first and last names are required',
      onlyEnglishAlphabets: 'Name may only contain english alphabets',
      cvcRequired: 'Security code is required',
      onlyDigits: 'Security code may only contain numbers',
      invalidCvc: 'Invalid security code',
      pay: 'Pay',
    },
  },
  ar: {
    translation: {
      nameOnCard: 'الاسم على البطاقة',
      cardNumber: 'رقم البطاقة',
      expiry: 'تاريخ الإنتهاء',
      cvc: 'رمز الأمان',
      cardNumberRequired: 'رقم البطاقة مطلوب',
      invalidCardNumber: 'رقم البطاقة غير صحيح',
      unsupportedCreditCardNetwork: 'شبكة البطاقة غير مدعومة',
      expiryRequired: 'تاريخ الإنتهاء مطلوب',
      invalidExpiry: 'تاريخ الإنتهاء غير صحيح',
      expiredCard: 'البطاقة منتهية',
      nameRequired: 'الاسم مطلوب',
      bothNamesRequired: 'الاسم الأول والأخير مطلوبان',
      onlyEnglishAlphabets: 'يجب أن يحتوي الاسم على حروف إنجليزية فقط',
      cvcRequired: 'رمز الأمان مطلوب',
      onlyDigits: 'رمز الأمان يجب أن يحتوي على أرقام فقط',
      invalidCvc: 'رمز الأمان غير صحيح',
      pay: 'ادفع',
    },
  },
};

// TODO: Check 'https://www.npmjs.com/package/i18next-browser-languagedetector' when supporting web
export const currentLang =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale.substring(0, 2)
    : NativeModules.I18nManager.localeIdentifier.substring(0, 2);

i18n.use(initReactI18next).init({
  resources: resources,
  compatibilityJSON: 'v3',
  lng: currentLang,
  fallbackLng: ['en', 'ar'],
});

export function isArabicLang(): boolean {
  return currentLang === 'ar';
}
