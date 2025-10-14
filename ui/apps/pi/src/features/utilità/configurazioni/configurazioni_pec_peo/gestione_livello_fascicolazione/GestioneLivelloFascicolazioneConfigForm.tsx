import { FCC } from '@cmrc/types/FCC';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import toast from '@cmrc/ui/components/Toast';
import { useSetMaxLivelloFascicolazioneForTitolarioMutation } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from './dictionary';
import { useGestioneLivelloFascicolazioneForm } from './forms/useGestioneLivelloFascicolazioneForm';
import { useGetMaxLivelloFascicolazione } from './hooks/useGetMaxLivelloFascicolazione';
import { useDialog } from '../../../../../store/dialog/useDialog';
import Dialog from '@cmrc/ui/components/Dialog';
import ConfirmDialog from '../../../../../components/ConfirmDialog';

export const GestioneLivelloFascicolazioneConfigForm: FCC = () => {
  const { data } = useGetMaxLivelloFascicolazione();
  const { methods, structure } = useGestioneLivelloFascicolazioneForm({
    initialData: data?.getMaxLivelloFascicolazioneForTitolario
  });
  const { open, close, isOpen } = useDialog({
    dialog_id: `setLivelloFascicolazione`
  });
  const [saveMutation] = useSetMaxLivelloFascicolazioneForTitolarioMutation();

  const onConfirm = async ({ ...values }) => {
    const livello = Number(values?.livello);
    if (values?.livello !== null) {
      if (Number.isNaN(livello)) {
        toast.error(dictionary.get('numberRequired'));
      } else {
        const responseSave = await saveMutation({
          livello: livello
        }).unwrap();
        if (responseSave?.setMaxLivelloFascicolazioneForTitolario) {
          toast.success(dictionary.get('saveSuccess'));
        }
      }
    }
  };

  return (
    <Grid container direction="column" rowSpacing={3} sx={{ padding: 3 }}>
      <Grid item>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid item>
        <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
          <LoadingButton
            onClick={open}
            size="small"
            variant="contained"
            sx={{ height: '30px' }}
          >
            {dictionary.get('save')}
          </LoadingButton>
        </Grid>
      </Grid>
      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={close}
        title={dictionary.get('saveLivelloFascicolazione')}
      >
        <ConfirmDialog
          message={dictionary.get('confirmSaveMessage', {
            livello: methods?.getValues()?.livello?.toString()
          })}
          cancelString={dictionary.get('annulla')}
          confirmString={dictionary.get('conferma')}
          onConfirm={methods.handleSubmit((values) => onConfirm(values))}
        />
      </Dialog>
    </Grid>
  );
};
