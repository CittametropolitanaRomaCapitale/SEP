import { FCC } from '@cmrc/types/FCC';
import Checkbox from '@cmrc/ui/form/FormComponents/Checkbox';
import Box from '@mui/material/Box';
import React from 'react';

export const CheckboxCell: FCC<unknown> = () => (
  <Box onClick={(event) => event.stopPropagation()}>
    <Checkbox label="" />
  </Box>
);
