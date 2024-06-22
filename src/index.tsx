import { type ViewStyle, View, Text } from 'react-native';
import React from 'react';
import './localizations/i18n';
import { Trans } from 'react-i18next';

type MoyasarSdkProps = {
  color: string;
  style: ViewStyle;
};

export const MoyasarSdkView = (moyasarSdkProps: MoyasarSdkProps) => {
  return (
    <View>
      <Text style={{ ...moyasarSdkProps.style, color: moyasarSdkProps.color }}>
        <Trans i18nKey="nameOnCard" />
      </Text>
    </View>
  );
};
