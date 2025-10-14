import { FCC } from '@cmrc/types/FCC';
import Grid from '@mui/material/Grid';

export type LabelItemProps = {
  label: string;
  value: string | JSX.Element;
  labelIsUppercase?: boolean;
  sx?: any;
  sxValue?: any;
};

const LabelItem: FCC<LabelItemProps> = ({
  label,
  value,
  labelIsUppercase,
  sx,
  sxValue
}) => {
  return (
    <Grid container direction={'column'}>
      <Grid
        item
        sx={(theme) => ({
          color: theme.palette.primary.main,
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          lineHeight: '1.2',
          ...sx
        })}
      >
        {label}
      </Grid>
      <Grid item sx={{...sxValue, fontWeight: '600', fontSize: '0.875rem' }}>
        {value || '-'}
      </Grid>
    </Grid>
  );
};

export default LabelItem;
