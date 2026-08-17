import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  isSamsungPayAvailable(serviceId: string): Promise<boolean>;
}

let instance: Spec | null = null;

const getInstance = (): Spec | null => {
  if (!instance) {
    instance = TurboModuleRegistry.get<Spec>('RTNSamsungPay');
  }
  return instance;
};

export default getInstance();
