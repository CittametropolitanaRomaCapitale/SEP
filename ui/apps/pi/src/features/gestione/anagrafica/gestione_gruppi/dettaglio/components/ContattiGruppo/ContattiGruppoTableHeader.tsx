import { FCC } from "@cmrc/types/FCC";
import Grid from "@mui/material/Grid";
import TableExternalHeader from "@cmrc/ui/components/Table/TableExternalHeader";
import { useOffice } from "@cmrc/auth/useOffice";
import { useGetQueryAnagraficaList } from "../../../../gestione_anagrafica/hooks/useDataAnagraficaList";
import { AddContattoToGruppoButton } from "./buttons/AddContattoToGruppoButton";
import { dictionary } from "./dictionary";

export const ContattiGruppoTableHeader: FCC = () => {
  const { isLoading } = useGetQueryAnagraficaList();
  const { isUserPIAdmin, isUserArchivista } = useOffice()

  return (
    <TableExternalHeader
      title={dictionary.get('contattiGruppo')}
      rightElement={
        <Grid
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            mb: 0.5
          }}
        >
          {!isLoading && (isUserPIAdmin || isUserArchivista) &&
            <AddContattoToGruppoButton />
          }
        </Grid>
      }
    />
  )
}