import { useEffect } from 'react';
import { FCC } from '@cmrc/types/FCC';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { RicercaProtocolliDtoInput } from '@cmrc/services/src/app/piapi/generated';
import Grid from '@mui/material/Grid';
import { useFormSearchProtocolli } from '../../hooks/useFormSearchProtocolli';
import { useTable } from '../../store/table/useTable';
import { dictionary } from '../../dictionary';

export const FormSearchProtocolli: FCC<{defaultValues?: RicercaProtocolliDtoInput}> = ({ defaultValues }) => {
  const { methods, structure } = useFormSearchProtocolli({
    initialData: defaultValues
  });

  const { setFilters } = useTable({
    table_id: 'searchProtocolliList'
  });

  const onSearch = methods.handleSubmit(
    ({...values }) => {
      setFilters({
        ...values
      });
    }
  );

  useEffect(
    () => () => {
      /** clean up */
      setFilters(undefined);
    },
    []
  );

  return (
    <Grid container direction="row">
    <Grid xs={11} item>
      <FormGenerator methods={methods} structure={structure} />
    </Grid>
    <Grid item>
      <LoadingButton size="small" variant="contained" onClick={onSearch}>
        {dictionary.get('search')}
      </LoadingButton>
    </Grid>
  </Grid>
  );
};
