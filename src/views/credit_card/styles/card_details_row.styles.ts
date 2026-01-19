import { StyleSheet } from 'react-native';
import { readexRegular } from '../../../helpers/fonts';

export const cardDetailsRowStyles = StyleSheet.create({
  groupRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 45,
  },

  groupCol: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 6,
    minHeight: 45,
  },

  // Input inside card group
  groupInput: {
    width: '100%',
    fontSize: 16,
    direction: 'ltr',
    padding: 4,
    paddingHorizontal: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    ...readexRegular,
  },

  dividerVertical: {
    width: 1,
    height: '100%',
    alignSelf: 'stretch',
  },
});
