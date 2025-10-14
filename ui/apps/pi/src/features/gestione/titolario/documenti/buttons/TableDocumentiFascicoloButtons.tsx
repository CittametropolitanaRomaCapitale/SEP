import { FCC } from '@cmrc/types/FCC';
import Grid from '@mui/material/Grid';
import { EliminaDocumentoButton } from './EliminaDocumentoButton';
import { AllegatoTable } from '../../../../protocollo/allegati/hooks/useAllegatiService';
import { ScaricaDocumentoButton } from './ScaricaDocumentoButton';

export const TableDocumentiFascicoloButtons: FCC<{ documento?: AllegatoTable, disabled?: boolean }> = ({
  documento,
  disabled
}) => (
  <Grid justifyContent="end" display="flex" gap={1} width={1}>
    <ScaricaDocumentoButton documento={documento} />
    <EliminaDocumentoButton documento={documento} disabled={disabled} />
  </Grid>
);
