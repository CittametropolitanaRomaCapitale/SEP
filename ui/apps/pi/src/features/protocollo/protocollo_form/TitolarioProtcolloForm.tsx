import { UseFormReturn } from 'react-hook-form';
import { FCC } from '@cmrc/types/FCC';
import Grid from '@mui/material/Grid';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { ProtocolloForm } from './hooks/useDestinatariProtocolloForm';
import { useTitolarioProtcolloForm } from './hooks/useTitolarioProtcolloForm';

export interface TitolarioProtocolloProps {
  readMode?: boolean;
  formMethod: UseFormReturn<ProtocolloForm, any>;
  titolarioRequired?: boolean;
}

export const TitolarioProtcolloForm: FCC<TitolarioProtocolloProps> = ({
  readMode,
  formMethod,
  titolarioRequired
}) => {
  titolarioRequired;
  const { structure } = useTitolarioProtcolloForm({
    readMode,
    formMethod,
    titolarioRequired
  });

  return (
    <Grid item>
      <FormGenerator methods={formMethod} structure={structure} />
    </Grid>
  );
};
