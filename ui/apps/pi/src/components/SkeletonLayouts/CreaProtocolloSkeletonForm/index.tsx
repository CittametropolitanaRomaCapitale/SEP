import React from 'react';
import Grid from '@mui/material/Grid';
import MUISkeleton from '@mui/material/Skeleton';

// le animazioni sono ['pulse', 'wave, 'false']
const animation = 'wave';

export const CreaProtocolloSkeletonForm = () => (
    <Grid container paddingTop={2} paddingLeft={2} paddingRight={2} paddingBottom={2} rowSpacing={-1} spacing={1} direction="row">
      <Grid item xs={12} sm={6}>
        <MUISkeleton animation={animation} height="60px" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MUISkeleton animation={animation} height="60px" />
      </Grid>
      <Grid item xs={12} sm={12}>
        <MUISkeleton animation={animation} height="60px" />
      </Grid>
      <Grid item xs={12} sm={12}>
        <MUISkeleton animation={animation} height="60px" />
      </Grid>
      <Grid item xs={12} sm={12}>
        <MUISkeleton animation={animation} height="60px" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MUISkeleton animation={animation} height="60px" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MUISkeleton animation={animation} height="60px" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MUISkeleton animation={animation} height="150px" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MUISkeleton animation={animation} height="150px" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MUISkeleton animation={animation} height="60px" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MUISkeleton animation={animation} height="60px" />
      </Grid>
      <Grid item xs={12} sm={12}>
        <MUISkeleton animation={animation} height="100px" />
      </Grid>
    </Grid>
);
