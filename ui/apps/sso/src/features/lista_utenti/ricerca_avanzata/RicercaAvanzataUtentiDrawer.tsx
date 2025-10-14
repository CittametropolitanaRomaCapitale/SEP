import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useDrawer } from '../../../store/drawer/useDrawer';
import { useTable } from '../../../store/table/useTable';
import { useRicercaAvanzataListaUtentiForm } from './useRicercaAvanzataListaUtentiForm';
import { dictionary } from './dictionary';

export const RicercaAvanzataUtentiDrawer = () => {
  const { closeDrawer } = useDrawer({
    drawer_id: 'ricercaAvanzataUtentiDrawer'
  });

  const { tableData, setFilters } = useTable({
    table_id: 'listaUtenti'
  });

  const { advancedFilters } = tableData?.filters || {};
  const { structure, methods } =
    useRicercaAvanzataListaUtentiForm(advancedFilters);

  const onSearch = () => {
    closeDrawer();
    const values = methods.getValues();

    const searchValues = {
      ...values,
      application: values?.application || null,
      roles: values?.roles || [],
      types: values?.types || [],
      officeIds: values?.officeIds || []
    };

    Object.keys(searchValues).forEach(
      (k) => searchValues[k] === '' && delete searchValues[k]
    );

    setFilters({
      ...tableData.filters,
      advancedFilters: searchValues,
      isRicercaAvanzata: true
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
            {dictionary.get('annulla')}
          </Button>

          <Button
            onClick={methods.handleSubmit((values) => onSearch())}
            size="small"
            variant="contained"
          >
            {dictionary.get('cerca')}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};
