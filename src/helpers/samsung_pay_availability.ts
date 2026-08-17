import { Platform } from 'react-native';
import NativeRTNSamsungPay from '../specs/NativeRTNSamsungPay';
import { debugLog, errorLog } from './debug_log';

/**
 * Checks whether Samsung Pay is available and ready (set up and active) on the
 * current device.
 *
 * Returns `true` only when Samsung Pay is fully ready to process a payment
 * (Samsung's `SPAY_READY` status). Returns `false` on non-Android platforms,
 * when Samsung Pay is not supported, or when it is supported but not yet set
 * up / activated by the user.
 *
 * Important: this is a wallet readiness check, not a definitive merchant
 * service ID validation check. A `true` result means Samsung Pay reports the
 * device wallet as ready. It does not guarantee that the provided `serviceId`
 * is onboarded/approved for all operations.
 *
 * Use this to decide whether to show a Samsung Pay option in your own custom
 * payment UI before rendering the `SamsungPay` button.
 *
 * Note: service ID authorization issues may be reported through
 * Samsung error codes and `EXTRA_ERROR_REASON` values in failure callbacks of Samsung Pay operations (e.g. when clicking the Samsung Pay button or attempting a payment).
 *
 * @param serviceId - The Samsung Pay service ID generated in the Samsung
 *   merchant dashboard (the same `serviceId` used in `SamsungPayConfig`).
 * @returns A promise resolving to `true` if Samsung Pay is ready, otherwise
 *   `false`.
 */
export async function isSamsungPayAvailable(
  serviceId: string
): Promise<boolean> {
  if (Platform.OS !== 'android') {
    debugLog(
      'Moyasar SDK: Samsung Pay is only available on Android, returning false'
    );
    return false;
  }

  if (!serviceId || serviceId.trim().length === 0) {
    errorLog(
      'Moyasar SDK: A `serviceId` is required to check Samsung Pay availability'
    );
    return false;
  }

  try {
    if (!NativeRTNSamsungPay) {
      errorLog('Moyasar SDK: Samsung Pay native module is not available');
      return false;
    }

    return await NativeRTNSamsungPay.isSamsungPayAvailable(serviceId);
  } catch (error) {
    errorLog(`Moyasar SDK: Failed to check Samsung Pay availability, ${error}`);
    return false;
  }
}
