import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import Dialog from '@cmrc/ui/components/Dialog';
import { RaccomandataBaseFragment, useAnnullaRaccomandataMutation, useUpdateStatoRaccomandateForProtocolloMutation } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useGetQueryRaccomandateProtocolloList } from '../../hooks/useDataRaccomandateProtocollo';
import { dictionary } from '../../dictionary';
import { useDialog } from '../../../../../store/dialog/useDialog';
import { useAnnullaRaccomandataForm } from '../../form/hooks/useAnnullaRaccomandataForm';
import { useGetQueryStoricoList } from '../../../storicizzazione/hooks/useDataStoricoList';

export const AnnullaRaccomandataButton: FCC<{ raccomandata: RaccomandataBaseFragment, hidden }> = ({
  raccomandata,
  hidden
}) => {
  const { refetch: refetchRaccomandate } = useGetQueryRaccomandateProtocolloList();
  const { refetch: refetchStorico } = useGetQueryStoricoList();
  const { methods, structure } = useAnnullaRaccomandataForm();
  const [annullaRaccomandata] = useAnnullaRaccomandataMutation()
  const [updateStatoRaccomandate] = useUpdateStatoRaccomandateForProtocolloMutation();
  const { open, isOpen, close: closeDialog } = useDialog({
    dialog_id: `annullaRaccomandata_${raccomandata?.id}`
  })

  const onAnnullaRccomandata = async (values) => {
    try {
      const response = await annullaRaccomandata({ id: raccomandata?.id, motivazione: values?.motivazione }).unwrap();
      if (response?.annullaRaccomandata === true) {
        toast.success(dictionary.get('annullaRaccomandataOK'));
        refetchRaccomandate();
        refetchStorico();
      }
      else {
        await updateStatoRaccomandate({ id: raccomandata?.protocollo?.id }).unwrap();
      }
    }
    catch {
      refetchRaccomandate();
      closeDialog()
    }
  }

  return (
    <>
      {!hidden && (
        <Button
          size="small"
          sx={{ width: '30px', height: '30px', minWidth: '30px' }}
          onClick={open}
        >
          <CancelScheduleSendIcon titleAccess={dictionary.get('annullaRaccomandata')} color='error' />
        </Button>
      )}
      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={closeDialog}
        title={dictionary.get('annullaRaccomandata')}
      >
        <Grid
          container
          direction="column"
          rowSpacing={3}
          sx={{ padding: 5 }}
        >
          <Grid item>
            <Typography sx={{ pb: 1 }}>{dictionary.get('aggiungiMotivazione')}</Typography>
            <FormGenerator methods={methods} structure={structure} />
          </Grid>
          <Grid item>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end"  >
              <Button
                onClick={closeDialog}
                size="small"
                variant="outlined"
              >
                {dictionary.get('annulla')}
              </Button>
              <Button size="small" variant="contained" onClick={methods.handleSubmit((values) => onAnnullaRccomandata(values))}>
                {dictionary.get('procedi')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};
