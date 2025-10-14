import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { formatDate } from '@cmrc/ui/utils/formatters';
import { FCC } from '@cmrc/types/FCC';

export const CronologiaCardContainer: FCC<{
  date: Date;
}> = ({ date, children }) => (
  <Grid sx={{ marginBottom: 2 }}>
    <Grid item>
      <Typography color="primary" variant="caption" fontWeight="600">
        {formatDate({ date })}
      </Typography>
      <Grid item>{children}</Grid>
    </Grid>
  </Grid>
);
