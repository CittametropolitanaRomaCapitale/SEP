import { useState } from 'react';
import { Box, Button, Card, Grid } from '@mui/material';
import { FCC } from '@cmrc/types/FCC';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import { UseFormReturn } from 'react-hook-form';
import { RaccomandataProtocolloInputInput } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';
import { useDestinatarioRaccomandataForm } from './hooks/useDestinatarioRaccomandataForm';
import { useSelezionaDestinatarioForm } from './hooks/useSelezionaDestinatarioForm';

export interface DestinatarioRaccomandataFormProps {
  formMethod: UseFormReturn<RaccomandataProtocolloInputInput, any>;
  readMode?: boolean;
}

export const DestinatarioRaccomandataForm: FCC<
  DestinatarioRaccomandataFormProps
> = ({ formMethod, readMode }) => {
  const [confirmedDestinatario, setConfirmedDestinatario] = useState<
    number | null
  >(null);
  const { structure: selectDestinatarioStructure, methods: selectFormMethod } =
    useSelezionaDestinatarioForm(setConfirmedDestinatario, readMode);
  const { structure } = useDestinatarioRaccomandataForm({
    formMethod,
    confirmedDestinatario,
    readMode
  });

  return (
    <>
      <Box sx={{ marginBottom: 1 }}>
        <TableExternalHeader title={dictionary.get('destinatarioHeader')} />
      </Box>
      <Card sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 3 }}>
        <Grid
          container
          direction="column"
          rowSpacing={readMode ? 0 : 3}
          sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 0, my: 1 }}
        >
          { !readMode && <FormGenerator
            methods={selectFormMethod}
            structure={selectDestinatarioStructure}
            disabled={readMode}
          />}
          <Grid item>
            <FormGenerator
              methods={formMethod}
              structure={structure}
              disabled={readMode}
            />
          </Grid>
        </Grid>
      </Card>
    </>
  );
};
