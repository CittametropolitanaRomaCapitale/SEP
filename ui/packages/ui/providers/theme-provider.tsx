import { FCC } from '@cmrc/types/FCC';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { createTheme, ThemeConfig } from '../theme';

export const CMRCThemeProvider: FCC<{ config?: ThemeConfig }> = ({
  config = { mode: 'light' },
  children
}) => {
  return (
    <ThemeProvider
      theme={createTheme({
        mode: config?.mode
      })}
    >
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
