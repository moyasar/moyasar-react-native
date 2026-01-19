import { View } from 'react-native';
import { PoweredByLogo } from '../../../assets/powered_logo';
import { moyasarLogoStyles } from '../styles/moyasar_logo.styles';
import type { MoyasarLogoProps } from '../types';

export const MoyasarLogo = ({ isPortrait }: MoyasarLogoProps) => {
  return (
    <View
      style={[
        moyasarLogoStyles.moyasarLogo,
        { width: isPortrait ? '50%' : '30%' },
      ]}
    >
      <PoweredByLogo />
    </View>
  );
};
