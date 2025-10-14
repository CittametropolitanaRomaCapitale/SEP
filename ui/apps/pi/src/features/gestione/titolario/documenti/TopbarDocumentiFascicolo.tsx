import { FCC } from "@cmrc/types/FCC";
import { AllegatoBaseFragment, TitolarioOutputDto } from "@cmrc/services/src/app/piapi/generated";
import Grid from "@mui/material/Grid";
import { SpostaDocumentiButton } from "./buttons/SpostaDocumentiButton";
import { AggiungiDocumentiButton } from "./buttons/AggiungiDocumentiButton";
import { GetDataExtensionListProvider } from "../../../protocollo/allegati/hooks/useDataExtensionList";

export type TopbarDocumentiFascicoloProps = {
  disabled: boolean;
  itemSelected: TitolarioOutputDto;
  selectedDocumenti: AllegatoBaseFragment[];
}

export const TopbarDocumentiFascicolo: FCC<TopbarDocumentiFascicoloProps> = ({
  disabled,
  itemSelected,
  selectedDocumenti
}) => (
  <Grid sx={{ mb: 2, display: 'flex', justifyContent: 'right' }}>
    <GetDataExtensionListProvider>
      <SpostaDocumentiButton disabled={disabled} itemSelected={itemSelected} selectedDocumenti={selectedDocumenti} />
      <AggiungiDocumentiButton disabled={disabled} itemSelected={itemSelected} />
    </GetDataExtensionListProvider>
  </Grid>
)