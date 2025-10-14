import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@cmrc/ui/components/Dialog';
import toast from '@cmrc/ui/components/Toast';
import { useDeleteVisibilitaTitolarioMutation, VisibilitaTitolario } from '@cmrc/services/src/app/piapi/generated';
import { useGetQueryPermessiFascicolo } from '../../../hooks/useDataPermessiFascicolo';
import ConfirmDialog from '../../../../../../../components/ConfirmDialog';
import { dictionary } from '../dictionary';
import { useDialog } from '../../../../../../../store/dialog/useDialog';

export const EliminaPermessoButton: FCC<{ permesso?: VisibilitaTitolario }> = ({
  permesso
}) => {
  const { isOpen, open, close } = useDialog({
    dialog_id: `confermaEliminaPermesso_${permesso?.id}`
  })

  const { refetch } = useGetQueryPermessiFascicolo();
  const [deletePermesso] = useDeleteVisibilitaTitolarioMutation();

  const onDeletePermesso = async () => {
      const permessoIdToList: number[] = [permesso?.id];
      const response = await deletePermesso({ idVisibilitaList: permessoIdToList }).unwrap();
      if (response?.deleteVisibilitaTitolario) {
        toast.success(dictionary.get('deleteSuccess'));
        close();
        refetch();
      }
  };

  return (
    <>
      <Button
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        onClick={open}
      >
        <DeleteIcon titleAccess={dictionary.get('eliminaPermesso')} />
      </Button>
      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={close}
        title={dictionary.get('eliminaPermesso')}
      >
        <ConfirmDialog
          message={dictionary.get('confermaEliminazionePermesso')}
          cancelString={dictionary.get('annulla')}
          confirmString={dictionary.get('conferma')}
          onConfirm={onDeletePermesso}
        />
      </Dialog>
    </>
  );
};
