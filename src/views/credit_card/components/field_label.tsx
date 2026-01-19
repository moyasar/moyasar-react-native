import { View, Text } from 'react-native';
import { useTheme } from '../theme_context';
import { fieldLabelStyles } from '../styles/field_label.styles';
import type { FieldLabelProps } from '../types';

export const FieldLabel = ({
  labelText,
  errorText,
  isEmpty,
}: FieldLabelProps) => {
  const { themeColors, customStyle } = useTheme();

  const labelStyle = customStyle?.textInputsLabel ?? {
    ...fieldLabelStyles.labelText,
    color: themeColors.text,
  };

  const errorStyle = customStyle?.errorText ?? {
    ...fieldLabelStyles.labelTextError,
    color: themeColors.error,
  };

  if (errorText) {
    // Error state - show error message as label with auto-scaling text
    return (
      <View style={fieldLabelStyles.labelContainer}>
        <Text
          style={errorStyle}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.75}
        >
          {errorText}
        </Text>
      </View>
    );
  } else {
    // Normal or required state
    return (
      <View style={fieldLabelStyles.labelContainer}>
        <Text
          style={labelStyle}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.75}
        >
          {labelText}
        </Text>
        {isEmpty && <Text style={errorStyle}>REQUIRED</Text>}
      </View>
    );
  }
};
