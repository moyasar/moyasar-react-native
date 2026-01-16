import { StyleSheet } from 'react-native';
import { readexRegular } from '../../../helpers/fonts';

export const cardNumberInputStyles = StyleSheet.create({
  groupRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 45,
    paddingHorizontal: 15,
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

  cardNetworkLogoContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    end: 10,
    justifyContent: 'flex-end',
  },

  cardNetworkLogo: {
    marginEnd: 8,
    height: 35,
    width: 35,
  },
});
