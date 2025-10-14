import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import toast from '@cmrc/ui/components/Toast';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  ModelloAutomaticoDto,
  ModelloAutomaticoInputDtoInput,
  useCreateModelloAutomaticoMutation,
  useUpdateModelloAutomaticoMutation
} from '@cmrc/services/src/app/piapi/generated';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useModelloAutomaticoConfigForm } from './hooks/useModelloAutomaticoConfigForm';
import { dictionary } from './dictionary';
import { useDrawer } from '../../../store/drawer/useDrawer';
import { useGetQueryModelliConfig } from './hooks/useDataModelliConfig';
import { useOffice } from '@cmrc/auth/useOffice';

export interface ModelloAutomaticoDrawerProps {
  data?: ModelloAutomaticoDto;
}

export const ModelloAutomaticoDrawer: FCC<ModelloAutomaticoDrawerProps> = ({
  data
}) => {
  const { closeDrawer } = useDrawer({
    drawer_id: 'modelloAutomaticoDrawer'
  });
  const { methods, structure } = useModelloAutomaticoConfigForm({
    initialData: data
  });
  const { refetch } = useGetQueryModelliConfig();
  const [updateMutation, { isLoading: isLoadingUpdate }] =
    useUpdateModelloAutomaticoMutation();
  const [saveMutation, { isLoading: isLoadingSave }] =
    useCreateModelloAutomaticoMutation();
  const { cdrCode, isUserArchivista, isUserPIAdmin } = useOffice();

  const onSave = async ({ ...values }) => {
    if (values?.idTitolario !== null && values?.idTitolario.length > 1) {
      toast.warn(dictionary.get('titolarioJustOne'));
      return;
    }

    const idTitolario =
      values?.idTitolario !== null && values?.idTitolario.length > 0
        ? values?.idTitolario[0].id
        : null;

    const input: ModelloAutomaticoInputDtoInput = {
      nomeModello: values.nomeModello,
      oggettoProtocollo: values.oggettoProtocollo,
      metodoSpedizione: values.metodoSpedizione,
      tipoRegistrazione: values.tipoRegistrazione,
      cdrCode:
        !isUserPIAdmin && isUserArchivista ? cdrCode : values?.cdr?.value,
      idTitolario: idTitolario
    };

    if (data?.id) {
      const response = await updateMutation({
        id: data?.id,
        input: input
      }).unwrap();

      if (response?.updateModelloAutomatico) {
        closeDrawer();
        toast.success(dictionary.get('updateSuccess'));
        refetch();
      } else {
        toast.error(dictionary.get('updateError'));
      }
    } else {
      const response = await saveMutation({ input }).unwrap();

      if (response?.createModelloAutomatico) {
        closeDrawer();
        toast.success(dictionary.get('saveSuccess'));
        refetch();
      } else {
        toast.error(dictionary.get('saveError'));
      }
    }
  };

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1, sm: 480 }, padding: 3 }}
    >
      <Grid item>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid item>
        <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
          <Button
            onClick={closeDrawer}
            size="small"
            sx={{ height: '30px', mr: 1 }}
          >
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            onClick={methods.handleSubmit((values) => onSave(values))}
            size="small"
            variant="contained"
            loading={isLoadingSave || isLoadingUpdate}
            sx={{ height: '30px' }}
          >
            {dictionary.get('salva')}
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
