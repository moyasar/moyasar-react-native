import { StyleSheet, Platform } from 'react-native';

export const cardGroupContainerStyles = StyleSheet.create({
  // iOS shadow wrapper to show shadows correctly
  cardGroupShadowWrapper: {
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  // Card Group Container
  cardGroup: {
    borderWidth: 1,
    borderRadius: 12,

    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },

  dividerHorizontal: {
    height: 1,
    width: '100%',
  },
});
