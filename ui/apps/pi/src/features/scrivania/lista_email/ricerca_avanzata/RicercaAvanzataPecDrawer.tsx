import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { geEndOfDay, getStartOfDay } from '@cmrc/ui/utils/date-utils';
import { useForm } from 'react-hook-form';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { dictionary } from '../dictionary';
import { useFormRicercaAvanzataPec } from './useFormRicercaAvanzataPec';
import { useTable } from '../../../../store/table/useTable';

export const RicercaAvanzataPecDrawer = () => {
  const { closeDrawer } = useDrawer({
    drawer_id: 'ricercaAvanzataPecDrawer'
  });

  const { tableData, setFilters } = useTable({
    table_id: 'listaEmail'
  });

  const { advancedFilters } = tableData?.filters || {};
  const { structure } = useFormRicercaAvanzataPec();

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
      dataInvioFrom: values?.dataInvioFrom
        ? new Date(getStartOfDay(values?.dataInvioFrom)).toISOString()
        : undefined,

      dataInvioTo: values?.dataInvioTo
        ? new Date(geEndOfDay(values?.dataInvioTo)).toISOString()
        : undefined
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
