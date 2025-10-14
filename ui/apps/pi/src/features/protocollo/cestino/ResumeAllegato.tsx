import { FCC } from '@cmrc/types/FCC';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { useDialog } from '../../../store/dialog/useDialog';
import { dictionary } from './dictionary';

export interface ResumeAllegatoProps {
  allegatoData: ProtocolloBaseFragment;
  onResume: (protocollo: ProtocolloBaseFragment) => void;
}

export const ResumeAllegato: FCC<ResumeAllegatoProps> = ({
  allegatoData,
  onResume
}) => {
  const { close: closeDialog } = useDialog({
    dialog_id: `dialogResumeAllegato_${allegatoData?.id}`
  });

  const handleCloseDialog = () => {
    closeDialog();
  };
  const handleConfirm = () => {
    onResume(allegatoData);
    closeDialog();
  };

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 5 }}
    >
      <Grid item>
        <Typography sx={{ pb: 1 }}>
          {dictionary.get('domandaRipristinoAllegato', {
            nome: `${allegatoData?.oggetto}`
          })}
        </Typography>
      </Grid>
      <Grid item>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          justifyContent="flex-end"
        >
          <Button onClick={handleCloseDialog} size="small" variant="outlined">
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            onClick={handleConfirm}
            size="small"
            variant="contained"
          >
            {dictionary.get('conferma')}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};
