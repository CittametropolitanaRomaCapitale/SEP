import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material';
import { FCC } from '@cmrc/types/FCC';

export interface HorizontalLabelItemProps {
  label?: string;
  value?: string;
  valueSx?: SxProps<Theme>;
}

const HorizontalLabelItem: FCC<HorizontalLabelItemProps> = ({
  label,
  value,
  valueSx
}) => (
  <Stack
    direction="row"
    sx={(theme) => ({
      fontSize: '0.8rem',
      color: theme.palette.grey[600],
      pt: 0.5,
      pb: 0.5
    })}
  >
    <Grid sx={{ width: '50%' }}>{label}</Grid>
    <Grid
      sx={{
        width: '50%',
        display: 'flex',
        justifyContent: 'right',
        ...valueSx
      }}
    >
      {value}
    </Grid>
  </Stack>
);

export default HorizontalLabelItem;
