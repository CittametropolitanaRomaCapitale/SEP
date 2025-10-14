import React from 'react';
import { Box, Container } from '@mui/material';
import { FCC } from '@cmrc/types/FCC';

export const PageContainer: FCC = ({ children }) => (
  <Box
    component="main"
    sx={{
      flexGrow: 1,
      pt: 6,
      pb: 4,
      pr: 3,
      pl: {
        xs: 3,
        sm: 3,
        lg: 0
      }
    }}
  >
    <Container maxWidth="xl" disableGutters>
      {children}
    </Container>
  </Box>
);
