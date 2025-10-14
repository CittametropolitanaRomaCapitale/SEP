import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

export const PanelTopBar: FC<{ title: string; actions?: JSX.Element }> = ({
  title,
  actions
}) => (
  <Grid
    container
    justifyContent="space-between"
    sx={{
      m: 2,
      paddingY: 1,
      paddingX: 2
    }}
  >
    <Grid item flex={1}>
      <Typography sx={{ textTransform: 'uppercase' }}>{title}</Typography>
    </Grid>

    <Grid item>{actions && actions}</Grid>
  </Grid>
);
