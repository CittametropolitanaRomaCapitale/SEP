import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { geEndOfDay, getStartOfDay } from '@cmrc/ui/utils/date-utils';
import { useForm } from 'react-hook-form';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { dictionary } from '../dictionary';
import { useFormRicercaAvanzataProtocolli } from './useFormRicercaAvanzataProtocolli';
import { useTable } from '../../../../store/table/useTable';
import { TitolarioProtcolloForm } from '../../../protocollo/protocollo_form/TitolarioProtcolloForm';

export const RicercaAvanzataProtocolliDrawer = () => {
  const { closeDrawer } = useDrawer({
    drawer_id: 'ricercaAvanzataProtocolliDrawer'
  });

  const { tableData, setFilters } = useTable({
    table_id: 'listaProtocolli'
  });

  const { advancedFilters } = tableData?.filters || {};
  const { structure } = useFormRicercaAvanzataProtocolli();

  const methods = useForm({
    defaultValues: advancedFilters,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const onSearch = () => {
    closeDrawer();
    const values = methods.getValues();
    const searchValues = {
      ...values,

      dataCreazioneFrom: values?.dataCreazioneFrom
        ? new Date(getStartOfDay(values?.dataCreazioneFrom)).toISOString()
        : undefined,

      dataCreazioneTo: values?.dataCreazioneTo
        ? new Date(geEndOfDay(values?.dataCreazioneTo)).toISOString()
        : undefined,

      dataCreazioneEmergenzaFrom: values?.dataCreazioneEmergenzaFrom
        ? new Date(
            getStartOfDay(values?.dataCreazioneEmergenzaFrom)
          ).toISOString()
        : undefined,

      dataCreazioneEmergenzaTo: values?.dataCreazioneEmergenzaTo
        ? new Date(geEndOfDay(values?.dataCreazioneEmergenzaTo)).toISOString()
        : undefined,

      cdr:
        values?.advUfficio &&
        values?.advUfficio?.map((cdr: { value: string }) => cdr.value),
      tagList:
        values?.advTag &&
        values?.advTag?.map((tag: { value: string }) => tag.value)
    };

    Object.keys(searchValues).forEach(
      (k) => searchValues[k] === '' && delete searchValues[k]
    );

    setFilters({
      ...tableData.filters,
      ...(Object.keys(searchValues).length
        ? { advancedFilters: searchValues, isRicercaAvanzata: true }
        : {})
    });
  };

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1, sm: 600 }, padding: 3 }}
    >
      <Grid item>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <TitolarioProtcolloForm formMethod={methods} titolarioRequired={false} />
      <Grid item>
        <Stack
          direction="row"
          spacing={1}
          alignItems="end"
          justifyContent="end"
        >
          <Button onClick={closeDrawer} size="small">
            {dictionary.get('cancel')}
          </Button>
          <Button onClick={onSearch} size="small" variant="contained">
            {dictionary.get('search')}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};
