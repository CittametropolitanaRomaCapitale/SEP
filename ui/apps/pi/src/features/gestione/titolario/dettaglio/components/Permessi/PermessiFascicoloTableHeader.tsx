import { FCC } from "@cmrc/types/FCC";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Drawer from "@cmrc/ui/components/Drawer";
import TableExternalHeader from "@cmrc/ui/components/Table/TableExternalHeader";
import { useDrawer } from "../../../../../../store/drawer/useDrawer";
import { PaginationPermessiFascicolo } from "./PaginationPermessiFascicolo";
import { AggiungiPermessiForm } from "./aggiungi_permessi/AggiungiPermessiForm";
import { useGetQueryPermessiFascicolo } from "../../hooks/useDataPermessiFascicolo";
import { dictionary } from "./dictionary";

export const PermessiFascicoloTableHeader: FCC = () => {
  const { isLoading } = useGetQueryPermessiFascicolo();
  const { openDrawer, isOpenDrawer, closeDrawer } = useDrawer({
    drawer_id: 'titolarioPermessiDrawer'
  });

  return (
    <>
      <TableExternalHeader
        title={dictionary.get('permessiVisibilita')}
        rightElement={
          <Grid
            sx={{
              m: 2,
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5
            }}
          >
            {!isLoading &&
              <Button
                onClick={openDrawer}
                size="small"
                sx={{ mr: 1 }}
                variant="outlined"
                aria-label="aggiungi-permesso"
              >
                {dictionary.get('aggiungiPermesso')}
              </Button>
            }
            <PaginationPermessiFascicolo />
          </Grid>
        }
      />
      <Drawer
        title={dictionary.get('aggiungiPermesso')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <AggiungiPermessiForm />
      </Drawer>
    </>
  )
}