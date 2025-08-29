import { Platform } from 'react-native';
import type { TextStyle } from 'react-native';

enum ReadexWeight {
  Regular = '400',
  Medium = '500',
}

const suffixMap: Record<ReadexWeight, string> = {
  [ReadexWeight.Regular]: 'Regular',
  [ReadexWeight.Medium]: 'Medium',
};

function readex(weight: ReadexWeight = ReadexWeight.Regular): TextStyle {
  const suffix = suffixMap[weight];

  if (Platform.OS === 'android') {
    return { fontFamily: `ReadexPro-${suffix}` };
  } else {
    return {
      fontFamily: `ReadexPro-${suffix}`,
      fontWeight: weight,
    };
  }
}

export const readexRegular = readex(ReadexWeight.Regular);
export const readexMedium = readex(ReadexWeight.Medium);
