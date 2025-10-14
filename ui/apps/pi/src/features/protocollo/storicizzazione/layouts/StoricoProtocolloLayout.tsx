import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import { PaginazioneStorico } from '../PaginazioneStorico';
import { StoricoList } from '../StoricoList';
import { GetDataStoricoListProvider } from '../hooks/useDataStoricoList';
import { Grid } from '@mui/material';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useStoricoForm } from '../form/useStoricoForm';
import { useState } from 'react';

export const StoricoProtocolloLayout = ({ protocolloData, cdr, cdrCode }) => {
  const [isFilteredByCdr, setIsFilteredByCdr] = useState(false);
  const { methods, structure } = useStoricoForm(cdr, (value) => {
    setIsFilteredByCdr(value);
  });

  return (
    <GetDataStoricoListProvider
      idProtocollo={protocolloData?.id}
      cdrCode={cdrCode}
      isFilteredByCdr={isFilteredByCdr}
    >
      <>
        <TableExternalHeader
          rightElement={
            <Grid container alignItems="center">
              <Grid item>
                <FormGenerator methods={methods} structure={structure} />
              </Grid>
              <Grid item>
                <PaginazioneStorico />
              </Grid>
            </Grid>
          }
        />
        <StoricoList />
      </>
    </GetDataStoricoListProvider>
  );
};
