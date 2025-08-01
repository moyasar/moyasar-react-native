import type { HostComponent, ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export const SAMSUNG_PAY_BUTTON_COMPONENT_NAME = 'RTNSamsungPayButton';

export interface MerchantInfo {
  serviceId: string;
  merchantName: string;
  merchantId: string;
  merchantCountryCode: string;
  amount: Double;
  currency: string;
  supportedNetworks: string[];
  orderNumber?: string | null; // Must for VISA payments
  /** Corner radius in DP unit */
  buttonBorderRadius?: Double | null;
}

type SamsungPayPaymentResultEvent = {
  result: string;
  orderNumber: string;
};

export interface NativeProps extends ViewProps {
  merchantInfo: MerchantInfo;
  onPaymentResult: DirectEventHandler<SamsungPayPaymentResultEvent>;
}

export default codegenNativeComponent<NativeProps>(
  'RTNSamsungPayButton'
) as HostComponent<NativeProps>;
