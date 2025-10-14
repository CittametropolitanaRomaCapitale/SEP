import { Grid } from '@mui/material';
import { FCC } from '@cmrc/types/FCC';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { UseFormReturn } from 'react-hook-form';
import {
  ProtocolloForm,
  useDestinatariProtocolloForm
} from './hooks/useDestinatariProtocolloForm';

export interface DestinatariProtocolloFormProps {
  readMode?: boolean;
  isFlagTag?: boolean;
  tipoRegistrazioneSel: string;
  metodoSpedizioneSel: string;
  formMethod: UseFormReturn<ProtocolloForm, any>;
}

export const DestinatariProtocolloForm: FCC<DestinatariProtocolloFormProps> = ({
  readMode,
  tipoRegistrazioneSel,
  metodoSpedizioneSel,
  formMethod,
  isFlagTag
}) => {
  const { structure } = useDestinatariProtocolloForm(
    readMode,
    tipoRegistrazioneSel,
    metodoSpedizioneSel,
    formMethod,
    isFlagTag
  );

  return (
    <Grid item>
      <FormGenerator methods={formMethod} structure={structure} />
    </Grid>
  );
};
