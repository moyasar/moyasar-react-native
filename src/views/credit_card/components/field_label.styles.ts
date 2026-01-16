import { StyleSheet, Platform } from 'react-native';
import { readexRegular } from '../../../helpers/fonts';

export const fieldLabelStyles = StyleSheet.create({
  // Label container for showing label + required
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 6,
  },

  // Label text - normal state
  labelText: {
    fontSize: 16,
    lineHeight: Platform.OS === 'ios' ? 26 : undefined,
    flexShrink: 1,
    ...readexRegular,
  },

  // Error state label
  labelTextError: {
    fontSize: 16,
    lineHeight: Platform.OS === 'ios' ? 26 : undefined,
    flexShrink: 1,
    ...readexRegular,
  },

  // Required text
  requiredText: {
    fontSize: 14,
    lineHeight: Platform.OS === 'ios' ? 26 : undefined,
    flexShrink: 1,
    ...readexRegular,
  },
});
