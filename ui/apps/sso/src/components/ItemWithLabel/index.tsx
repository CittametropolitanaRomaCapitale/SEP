import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

interface ItemWithLabelProps {
  label: string;
  value?: string;
}

export const ItemWithLabel: FC<ItemWithLabelProps> = ({ label, value }) => (
  <Grid container sx={{ flexDirection: 'column' }} spacing={1}>
    <Grid item>
      <Typography
        variant="body2"
        sx={(theme) => ({
          color: theme.palette.primary.main,
          fontWeight: theme.typography.fontWeightBold,
          textTransform: 'uppercase'
        })}
      >
        {label}
      </Typography>
    </Grid>
    <Grid item>
      <Typography variant="subtitle2">{value || '-'}</Typography>
    </Grid>
  </Grid>
);
