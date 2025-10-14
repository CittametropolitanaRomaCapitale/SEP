import React from 'react';
import Grid from '@mui/material/Grid';
import MUISkeleton from '@mui/material/Skeleton';
import { Stack } from '@mui/material';

// le animazioni sono ['pulse', 'wave, 'false']
const animation = 'wave';

export const DettaglioFascicoloSkeletonHeader = () => (
  <>
    <Stack
      paddingTop={0}
      paddingLeft={2}
      paddingRight={2}
      paddingBottom={0}
      spacing='auto'
      direction="row"
    >
      <Grid item>
        <MUISkeleton animation={animation} width="100px" />
        <MUISkeleton animation={animation} width="300px" />
      </Grid>
    </Stack><Stack
      paddingTop={1}
      paddingLeft={2}
      paddingRight={2}
      paddingBottom={1}
      spacing='auto'
      direction="row"
    >
      <Grid item>
        <MUISkeleton animation={animation} width="150px" />
        <MUISkeleton animation={animation} width="100px" />
      </Grid>
      <Grid item>
        <MUISkeleton animation={animation} width="150px" />
        <MUISkeleton animation={animation} width="100px" />
      </Grid>
      <Grid item>
        <MUISkeleton animation={animation} width="150px" />
        <MUISkeleton animation={animation} width="100px" />
      </Grid>
      <Grid item>
        <MUISkeleton animation={animation} width="150px" />
        <MUISkeleton animation={animation} width="100px" />
      </Grid>
      <Grid item>
        <MUISkeleton animation={animation} width="150px" />
        <MUISkeleton animation={animation} width="100px" />
      </Grid>
      <Grid item>
        <MUISkeleton animation={animation} width="150px" />
        <MUISkeleton animation={animation} width="100px" />
      </Grid>
    </Stack>
  </>
);
