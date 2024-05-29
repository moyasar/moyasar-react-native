import { Platform, type ViewStyle, View, Text } from 'react-native';
import React from 'react';

const LINKING_ERROR =
  `The package 'react-native-moyasar-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type MoyasarSdkProps = {
  color: string;
  style: ViewStyle;
};

export const MoyasarSdkView = (moyasarSdkProps: MoyasarSdkProps) => {
  return (
    <View>
      <Text style={{ ...moyasarSdkProps.style, color: moyasarSdkProps.color }}>
        {LINKING_ERROR}
      </Text>
    </View>
  );
};
