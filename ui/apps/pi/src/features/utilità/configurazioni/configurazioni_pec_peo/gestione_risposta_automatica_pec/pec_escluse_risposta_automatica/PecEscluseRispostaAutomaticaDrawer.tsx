import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { PecEscluseRispostaAutomatica } from '@cmrc/services/src/app/piapi/generated';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useDrawer } from '../../../../../../store/drawer/useDrawer';
import { useGetQueryPecEscluseList } from '../hooks/useDataPecEscluseRispostaAutomatica';
import { useGestionePecEscluseRispostaAutomatica } from '../hooks/useGestionePecEscluseRispostaAutomatica';
import { dictionary } from '../dictionary';
import { usePecEscluseRispostaAutomaticaForm } from '../forms/usePecEscluseRispostaAutomaticaForm';

type PecEscluseRispostaAutomaticaProps = {
  pecEsclusaSelected?: PecEscluseRispostaAutomatica;
};

export const PecEscluseRispostaAutomaticaDrawer: FCC<
  PecEscluseRispostaAutomaticaProps
> = ({ pecEsclusaSelected }) => {
  const { closeDrawer } = useDrawer({
    drawer_id: `pecEscluseRispostaAutomaticaDrawer_${pecEsclusaSelected?.id}`
  });
  const { methods, structure } = usePecEscluseRispostaAutomaticaForm({
    initialData: pecEsclusaSelected
  });
  const { isLoadingSave, savePecEsclusa, updatePecEsclusa } =
    useGestionePecEscluseRispostaAutomatica();
  const { refetch } = useGetQueryPecEscluseList();

  const onSave = async ({ ...values }) => {
    if (pecEsclusaSelected?.id) {
      const response = await updatePecEsclusa({
        id: pecEsclusaSelected?.id,
        pecInput: {
          indirizzo: values?.indirizzo
        }
      });
      if (response?.updatePecEsclusa) {
        refetch();
        closeDrawer();
      }
    } else {
      const response = await savePecEsclusa({
        indirizzo: values?.indirizzo
      });
      if (response?.savePecEsclusa) {
        refetch();
        closeDrawer();
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
            loading={isLoadingSave}
            sx={{ height: '30px' }}
          >
            {dictionary.get('salva')}
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
