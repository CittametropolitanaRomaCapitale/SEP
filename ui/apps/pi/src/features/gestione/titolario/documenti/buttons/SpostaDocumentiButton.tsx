import { FCC } from "@cmrc/types/FCC";
import { AllegatoBaseFragment, TitolarioOutputDto } from "@cmrc/services/src/app/piapi/generated";
import Button from "@mui/material/Button";
import MoveUpRoundedIcon from '@mui/icons-material/MoveUpRounded';
import { shortenFilename } from '@cmrc/ui/utils/string-utils';
import { useSnackbar } from "../../../../../store/snackbar/useSnackBar";
import { useDialog } from "../../../../../store/dialog/useDialog";
import { dictionary } from "../dictionary";
import { useGetDocumentiTitolarioListQuery } from "../hooks/useDataDocumentiFascicolo";

export type SpostaDocumentiProps = {
  disabled: boolean;
  itemSelected: TitolarioOutputDto;
  selectedDocumenti: AllegatoBaseFragment[];
}

export const SpostaDocumentiButton: FCC<SpostaDocumentiProps> = ({
  disabled,
  itemSelected,
  selectedDocumenti
}) => {
  const { data } = useGetDocumentiTitolarioListQuery();

  const { openWithList } = useSnackbar(
    { snackBarId: 'spostaDocumenti' }
  );

  const { close } = useDialog({
    dialog_id: `dialogVisualizzaDocumenti${itemSelected?.id}`
  })

  const spostaDcoumenti = () => {
    const messageList = selectedDocumenti.map(documento => ({
      id: documento?.id,
      message: shortenFilename(documento?.nome, 20)
    }));

    openWithList(messageList);
    close()
  }

  return (
    <Button
      disabled={selectedDocumenti?.length === 0 || data?.getAllegati?.allegati?.length === 0 || disabled}
      onClick={spostaDcoumenti}
      size="small"
      sx={{ mr: 1 }}
      variant="contained"
      startIcon={<MoveUpRoundedIcon />}
    >
      {dictionary.get('spostaDocumenti')}
    </Button>
  )

}