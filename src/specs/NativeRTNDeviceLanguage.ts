import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getSystemLanguage(): string;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RTNDeviceLanguage');
