import { View, TextInput } from 'react-native';
import { getConfiguredLocalizations } from '../../../localizations/i18n';
import { useTheme } from '../theme_context';
import { FieldLabel } from './field_label';
import { nameInputStyles } from './name_input.styles';
import type { NameInputProps } from '../types';
import { getInputBorderStyle } from '../../../helpers/styles_utils';

export const NameInput = ({
  value,
  error,
  isEmpty,
  onChangeText,
  onSubmitEditing,
  inputRef,
  disabled,
}: NameInputProps) => {
  const { t } = getConfiguredLocalizations();
  const { themeColors, customStyle } = useTheme();

  return (
    <>
      <FieldLabel
        labelText={t('moyasarTranslation:nameOnCard')}
        errorText={error}
        isEmpty={isEmpty && !error}
      />
      <View style={nameInputStyles.inputSubContainer}>
        <TextInput
          style={[
            {
              ...nameInputStyles.inputStandalone,
              ...getInputBorderStyle(!!error, themeColors),
              color: themeColors.text,
              backgroundColor: themeColors.inputBackground,
            },
            customStyle?.standaloneTextInput,
          ]}
          value={value}
          ref={inputRef}
          returnKeyType="next"
          onSubmitEditing={onSubmitEditing}
          onChangeText={onChangeText}
          placeholder={t('moyasarTranslation:nameOnCardPlaceholder')}
          placeholderTextColor={
            customStyle?.textInputsPlaceholderColor ?? themeColors.placeholder
          }
          autoCorrect={false}
          editable={!disabled}
          accessibilityLabel={t('moyasarTranslation:nameOnCardPlaceholder')}
          testID="moyasar-name-on-card-input"
        />
      </View>
    </>
  );
};
