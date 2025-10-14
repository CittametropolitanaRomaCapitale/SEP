import React from 'react';
import Grid from '@mui/material/Grid';
import MUISkeleton from '@mui/material/Skeleton';
import { Stack } from '@mui/material';

// le animazioni sono ['pulse', 'wave, 'false']
const animation = 'wave';

const RiepilogoSkeletonTop = () => (
  <Stack
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
);

export default RiepilogoSkeletonTop;
