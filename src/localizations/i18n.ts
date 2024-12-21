import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, NativeModules, Platform, Settings } from 'react-native';
import RTNDeviceLanguage from '../specs/NativeRTNDeviceLanguage';
import { errorLog } from '../helpers/debug_log';

const resources = {
  en: {
    moyasarTranslation: {
      nameOnCard: 'Name on Card',
      cardNumber: 'Card Number',
      expiry: 'Expiry (MM/YY)',
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
    moyasarTranslation: {
      nameOnCard: 'الاسم على البطاقة',
      cardNumber: 'رقم البطاقة',
      expiry: 'تاريخ الانتهاء (شهر/سنة)',
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

// App language is currently supported for new arch only, system language for the old arch
// TODO: Check 'https://www.npmjs.com/package/i18next-browser-languagedetector' when supporting web
export function getCurrentLang(): string {
  let lang: string | null | undefined;

  // iOS old arch
  if (
    Platform.OS === 'ios' &&
    NativeModules &&
    NativeModules.SettingsManager &&
    NativeModules.SettingsManager.settings
  ) {
    lang =
      NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]; // iOS 13
    // Android old arch
  } else if (NativeModules && NativeModules.I18nManager) {
    lang = NativeModules.I18nManager.localeIdentifier;
  }

  // New arch
  if (RTNDeviceLanguage && !lang) {
    lang = RTNDeviceLanguage.getPreferredLanguage();
  }

  // Fallback, should not be reached
  if (Platform.OS === 'ios' && !lang) {
    lang = Settings.get('AppleLocale') || Settings.get('AppleLanguages')[0];
  } else if (!lang) {
    lang = I18nManager.getConstants()?.localeIdentifier;
  }

  if (!lang) {
    errorLog('Could not get current language');
  }

  return lang?.substring(0, 2) || 'en';
}

// TODO: Optimize and find a better way to handle localizations in an SDK + Make sure that localizations are ready before showing any view
export function getConfiguredLocalizations(): typeof i18n {
  if (i18n.isInitialized) {
    if (!i18n.hasResourceBundle('en', 'moyasarTranslation')) {
      i18n.addResourceBundle(
        'en',
        'moyasarTranslation',
        resources.en.moyasarTranslation
      );
    }
    if (!i18n.hasResourceBundle('ar', 'moyasarTranslation')) {
      i18n.addResourceBundle(
        'ar',
        'moyasarTranslation',
        resources.ar.moyasarTranslation
      );
    }
  } else {
    i18n.use(initReactI18next).init({
      resources: resources,
      compatibilityJSON: 'v3',
      lng: getCurrentLang(),
      ns: 'moyasarTranslation',
      fallbackLng: ['en', 'ar'],
    });
  }

  return i18n;
}

export function isArabicLang(): boolean {
  return getCurrentLang() === 'ar';
}
