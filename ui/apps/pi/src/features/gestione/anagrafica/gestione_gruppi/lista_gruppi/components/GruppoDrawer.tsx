import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { Gruppo } from '@cmrc/services/src/app/piapi/generated';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useDrawer } from '../../../../../../store/drawer/useDrawer';
import { dictionary } from '../../dictionary';
import { useGestioneGruppi } from '../hooks/useGestioneGruppi';
import { useGetQueryGruppiList } from '../hooks/useDataGruppiList';
import { useGruppoForm } from '../forms/useGruppoForm';

export interface GruppoProps {
  data?: Gruppo;
  readMode?: boolean;
}

export const GruppoDrawer: FCC<GruppoProps> = ({ data, readMode }) => {
  const { closeDrawer } = useDrawer({
    drawer_id: 'gruppoDrawer'
  });
  const { methods, structure } = useGruppoForm({ initialData: data });
  const { saveGruppo, updateGruppo, isLoadingSave } = useGestioneGruppi();
  const { refetch } = useGetQueryGruppiList();

  const onSave = async ({ ...values }) => {
    if (data?.id) {
      const response = await updateGruppo({
        id: data?.id,
        input: {
          nome: values?.nome,
          note: values?.note,
        }
      })

      if (response?.updateGruppo?.id) {
        closeDrawer();
      }
      refetch();
    } else {
      const response = await saveGruppo({
        nome: values?.nome,
        note: values?.note,
      });

      if (response?.saveGruppo?.id) {
        closeDrawer();
      }
      refetch();
    }
  }

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1, sm: 480 }, padding: 3 }}
    >
      <Grid item>
        <FormGenerator methods={methods} structure={structure} disabled={readMode} />
      </Grid>
      {!readMode &&
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
      }
    </Grid>
  );
};