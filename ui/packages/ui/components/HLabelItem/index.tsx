import { FCC } from '@cmrc/types/FCC';
import Grid from '@mui/material/Grid';

export type HLabelItemProps = {
  label: string;
  value: string;
  labelIsUppercase?: boolean;
  sx?: any;
  labelSx?: any;
};

const HLabelItem: FCC<HLabelItemProps> = ({
  label,
  value,
  labelIsUppercase,
  sx,
  labelSx
}) => {
  return (
    <Grid
      container
      direction={'row'}
      display="flex"
      justifyContent={'space-between'}
      alignItems="baseline"
      sx={sx}
    >
      <Grid
        item
        sx={(theme) => ({
          minWidth: '50px',
          color: theme.palette.grey[600],
          fontWeight: 600,
          letterSpacing: -0.5,
          fontSize: '0.7rem',
          textTransform: labelIsUppercase ? 'uppercase' : 'inherit',
          ...labelSx
        })}
      >
        {label}
      </Grid>
      <Grid item sx={{ fontWeight: '600', fontSize: '0.8rem' }}>
        {value || '-'}
      </Grid>
    </Grid>
  );
};

export default HLabelItem;
