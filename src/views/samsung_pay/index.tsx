import {
  Platform,
  requireNativeComponent,
  View,
  type HostComponent,
} from 'react-native';
import type {
  MerchantInfo,
  NativeProps,
} from '../../specs/RTNSamsungPayNativeComponent.android';
import { SAMSUNG_PAY_BUTTON_COMPONENT_NAME } from '../../specs/RTNSamsungPayNativeComponent.android';
import { debugLog, errorLog } from '../../helpers/debug_log';

// Just a simple check for optimization when we are sure that the component will not be available on other devices
const isSamsungPayComponentAvailable = Platform.OS === 'android';

let SamsungPayButton: HostComponent<NativeProps>;

// For extreme cases where the component is not available, we will use an empty component
// @ts-expect-error - Using type assertion to maintain original type signature
let FallbackComponent = (() => {
  debugLog('Moyasar SDK: Rendering Samsung Pay fallback component');

  return <View style={{ width: 0, height: 0 }} />;
}) as HostComponent<NativeProps>;

if (isSamsungPayComponentAvailable) {
  // We will Use either codegen or requireNativeComponent based on availability

  // Try to import from the spec
  try {
    debugLog('Moyasar SDK: Importing Samsung Pay component from spec...');

    SamsungPayButton =
      require('../../specs/RTNSamsungPayNativeComponent').default;
  } catch (e) {
    debugLog(
      'Moyasar SDK: Samsung Pay component not found in spec, falling back to manual registration (old arch)...'
    );

    try {
      // Fallback to manual registration (old arch)
      SamsungPayButton = requireNativeComponent(
        SAMSUNG_PAY_BUTTON_COMPONENT_NAME
      );
    } catch (innerError) {
      errorLog(
        `Moyasar SDK: Failed to register Samsung Pay component manually. Please check your setup. ${innerError}`
      );

      SamsungPayButton = FallbackComponent;
    }
  }
} else {
  debugLog(
    'Moyasar SDK: Samsung Pay component is not available on this device.'
  );

  // Shouldn't really render because the Samsung Pay compoent checks if the device is an Android device, but if it does, we will use a fallback component

  SamsungPayButton = FallbackComponent;
}

export { SamsungPayButton };
export type { MerchantInfo };
