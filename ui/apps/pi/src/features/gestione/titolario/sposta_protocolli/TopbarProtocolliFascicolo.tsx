import { FCC } from "@cmrc/types/FCC";
import { ProtocolloBaseFragment, TitolarioOutputDto } from "@cmrc/services/src/app/piapi/generated";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MoveUpRoundedIcon from '@mui/icons-material/MoveUpRounded';
import { useDialog } from "../../../../store/dialog/useDialog";
import { dictionary } from "./dictionary";
import { useSnackbar } from "../../../../store/snackbar/useSnackBar";
import { useGetProtocolliByFascicoloListQuery } from "./hooks/useDataProtocolliTitolario";

export type TopbarProtocolliFascicoloProps = {
  disabled: boolean;
  itemSelected: TitolarioOutputDto;
  selectedProtocolli: ProtocolloBaseFragment[];
}

export const TopbarProtocolliFascicolo: FCC<TopbarProtocolliFascicoloProps> = ({
  disabled,
  itemSelected,
  selectedProtocolli
}) => {
  const { data } = useGetProtocolliByFascicoloListQuery();

  const { openWithList } = useSnackbar(
    { snackBarId: 'spostaProtocolli' }
  );

  const { close } = useDialog({
    dialog_id: `dialogVisualizzaProtocolli${itemSelected?.id}`
  })

  const spostaProtocolli = () => {
    const messageList = selectedProtocolli.map(protocollo => ({
      id: protocollo.id,
      message: protocollo.nProtocollo
    }));

    openWithList(messageList);
    close()
  }

  return (
    <Grid sx={{ mb: 2, display: 'flex', justifyContent: 'right' }}>
      <Button
        disabled={selectedProtocolli?.length === 0 || data?.getProtocolliByFascicolo?.protocolli?.length === 0  || disabled }
        onClick={spostaProtocolli}
        size="small"
        sx={{ mr: 1 }}
        variant="contained"
        startIcon={<MoveUpRoundedIcon/>}
      >
        {dictionary.get('spostaProtocolli')}
      </Button>
    </Grid>
  )

}