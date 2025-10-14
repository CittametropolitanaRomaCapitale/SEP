import React from 'react';
import Grid from '@mui/material/Grid';
import MUISkeleton from '@mui/material/Skeleton';
import { Stack } from '@mui/material';

// le animazioni sono ['pulse', 'wave, 'false']
const animation = 'wave';

export const DettaglioGruppoSkeletonHeader = () => (
  <Stack
    paddingTop={1}
    paddingLeft={2}
    paddingRight={2}
    paddingBottom={1}
    spacing={32}
    direction="row"
  >
    <Grid item>
      <MUISkeleton animation={animation} width="100px" />
      <MUISkeleton animation={animation} width="150px" />
    </Grid>
    <Grid item>
      <MUISkeleton animation={animation} width="100px" />
      <MUISkeleton animation={animation} width="150px" />
    </Grid>
    <Grid item>
      <MUISkeleton animation={animation} width="100px" />
      <MUISkeleton animation={animation} width="150px" />
    </Grid>
  </Stack>
);
