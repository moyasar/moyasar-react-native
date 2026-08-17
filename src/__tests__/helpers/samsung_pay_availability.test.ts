import { Platform } from 'react-native';
import { isSamsungPayAvailable } from '../../helpers/samsung_pay_availability';
import NativeRTNSamsungPay from '../../specs/NativeRTNSamsungPay';

jest.mock('../../specs/NativeRTNSamsungPay', () => ({
  __esModule: true,
  default: { isSamsungPayAvailable: jest.fn() },
}));

describe('isSamsungPayAvailable', () => {
  const serviceId = 'ea810dafb758408fa530b1';
  const nativeModule = NativeRTNSamsungPay as unknown as {
    isSamsungPayAvailable: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'android';
    // The helper logs via `console.error` in dev; keep test output clean.
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the native result when Samsung Pay is ready', async () => {
    nativeModule.isSamsungPayAvailable.mockResolvedValue(true);

    await expect(isSamsungPayAvailable(serviceId)).resolves.toBe(true);
    expect(nativeModule.isSamsungPayAvailable).toHaveBeenCalledWith(serviceId);
  });

  it('returns false when the native module reports not ready', async () => {
    nativeModule.isSamsungPayAvailable.mockResolvedValue(false);

    await expect(isSamsungPayAvailable(serviceId)).resolves.toBe(false);
  });

  it('returns false on non-Android platforms without calling native', async () => {
    Platform.OS = 'ios';

    await expect(isSamsungPayAvailable(serviceId)).resolves.toBe(false);
    expect(nativeModule.isSamsungPayAvailable).not.toHaveBeenCalled();
  });

  it('returns false and skips the native call when serviceId is blank', async () => {
    await expect(isSamsungPayAvailable('   ')).resolves.toBe(false);
    expect(nativeModule.isSamsungPayAvailable).not.toHaveBeenCalled();
  });

  it('returns false when the native call rejects', async () => {
    nativeModule.isSamsungPayAvailable.mockRejectedValue(new Error('boom'));

    await expect(isSamsungPayAvailable(serviceId)).resolves.toBe(false);
  });
});
