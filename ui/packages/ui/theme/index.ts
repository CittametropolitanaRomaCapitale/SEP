import {
  createTheme as createMuiTheme,
  Direction,
  responsiveFontSizes,
  Theme
} from '@mui/material';

import { baseThemeOptions } from './base-theme-options';
import { darkThemeOptions } from './dark-theme-options';
import { lightThemeOptions } from './light-theme-options';
import { blueThemeOptions } from './blue-theme-options';
import { piThemeOptions } from './pi-theme-options';
import { customThemeOptions } from './custom-theme-options';
import { sidThemeOptions } from './sid-theme-options';

interface Neutral {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    neutral?: Neutral;
  }

  interface PaletteOptions {
    neutral?: Neutral;
  }
}

export interface ThemeConfig {
  direction?: Direction;
  responsiveFontSizes?: boolean;
  mode: 'light' | 'dark' | 'blue' | 'pi' | 'sid';
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dark: true;
  }
}

const getTheme = (mode?: string) => {
  switch (mode) {
    case 'dark':
      return darkThemeOptions;

    case 'blue':
      return blueThemeOptions;

    case 'pi':
      return piThemeOptions;

    case 'sid':
      return sidThemeOptions;

    default:
      return lightThemeOptions;
  }
};

export const createTheme = (config: ThemeConfig): Theme => {
  let theme = createMuiTheme(
    baseThemeOptions,
    getTheme(config?.mode),
    {
      direction: config.direction
    },
    customThemeOptions
  );

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
