import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getPreferredLanguage(): string | null;
}

let instance: Spec | null = null;

const getInstance = (): Spec | null => {
  if (!instance) {
    instance = TurboModuleRegistry.get<Spec>('RTNDeviceLanguage');
  }
  return instance;
};

export default getInstance();
