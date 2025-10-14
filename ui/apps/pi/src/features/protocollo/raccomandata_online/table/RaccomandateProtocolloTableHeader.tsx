import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TableExternalHeader from "@cmrc/ui/components/Table/TableExternalHeader";
import FullScreenDialog from "@cmrc/ui/components/FullScreenDialog";
import { dictionary } from "../dictionary";
import { useDialog } from "../../../../store/dialog/useDialog";
import { RaccomandataForm } from "../form/RaccomandataForm";

export const RaccomandateProtocolloTableHeader = ({ protocolloData }) => {
  const { open, isOpen, close: closeDialog } = useDialog({
    dialog_id: "raccomandataDialog"
  })
  return (
    <>
      <TableExternalHeader
        title={dictionary.get('raccomandataOnline')}
        rightElement={
          <Grid
            sx={{
              m: 2,
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5
            }}
          >
            <Button
              onClick={open}
              size="small"
              sx={{ mr: 1 }}
              variant="outlined"
              aria-label="crea-raccomandata"
            >
              {dictionary.get('creaRaccomandata')}
            </Button>
          </Grid>
        } />
      <FullScreenDialog title={`${dictionary.get('titleRaccomandataDialog')} ${protocolloData?.nProtocollo}`} open={isOpen} onClose={closeDialog} contrastBackground>
        <RaccomandataForm protocolloData={protocolloData} readMode={false}/>
      </FullScreenDialog>
    </>
  )
}