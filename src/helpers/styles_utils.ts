import type { ThemeColors } from '../models/component_models/theme_colors';

// TODO: REfactor to be standalone and 'setStyle' rather than 'get'
export const getInputBorderStyle = (
  hasError: boolean,
  themeColors: ThemeColors
) => ({
  borderColor: hasError ? themeColors.error : themeColors.border,
});

export const getDividerStyle = (
  hasError: boolean,
  themeColors: ThemeColors
) => ({
  backgroundColor: hasError ? themeColors.error : themeColors.border,
});
