// Mock React Native modules before they're imported
const mockSettings = {
  get: (key) => {
    if (key === 'AppleLocale') return 'en-US';
    if (key === 'AppleLanguages') return ['en-US'];
    return null;
  },
  set: jest.fn(),
};

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  // Add Settings to RN export
  Object.defineProperty(RN, 'Settings', {
    get: () => mockSettings,
    enumerable: true,
    configurable: true,
  });

  return RN;
});

// Mock I18nManager
jest.mock('react-native/Libraries/ReactNative/I18nManager', () => ({
  getConstants: jest.fn(() => ({
    localeIdentifier: 'en_US',
    isRTL: false,
  })),
  isRTL: false,
  allowRTL: jest.fn(),
  forceRTL: jest.fn(),
}));

// Mock Platform.constants
jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const Platform = jest.requireActual(
    'react-native/Libraries/Utilities/Platform'
  );
  Platform.constants = {
    ...Platform.constants,
    Manufacturer: 'Apple',
  };
  return Platform;
});

// Mock react-native-url-polyfill
jest.mock('react-native-url-polyfill', () => ({
  URL: jest.requireActual('url').URL,
  URLSearchParams: jest.requireActual('url').URLSearchParams,
}));
