import LoadingButton from '@mui/lab/LoadingButton';
import { FCC } from '@cmrc/types/FCC';
import Dialog from '@cmrc/ui/components/Dialog';
import { useDeleteRegolaMutation } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { useDialog } from '../../../../../../store/dialog/useDialog';
import { dictionary } from './dictionary';
import ConfirmDialog from '../../../../../../components/ConfirmDialog';
import { useGetQueryPecRegole } from './hooks/usaDataRegoleMonitoraggio';

export const DeleteRegolaButton: FCC<{
  idEmail: number;
  idCategoriaRegola: number;
  closeDrawer: () => void;
}> = ({ idEmail, idCategoriaRegola, closeDrawer }) => {
  const { open, close, isOpen } = useDialog({
    dialog_id: `eliminaRegola_${idEmail}${idCategoriaRegola}`
  });

  const { refetch } = useGetQueryPecRegole();
  const [deleteRegola, { isLoading }] = useDeleteRegolaMutation();

  const onDeleteRegola = async () => {
    try {
      const response = await deleteRegola({
        idEmail,
        idCategoria: idCategoriaRegola
      }).unwrap();
      if (response?.deletePecRegola) {
        toast.success(dictionary.get('deleteRegolaSuccess'));
        refetch();
        closeDrawer();
      }
    } catch (e) {
      toast.error(dictionary.get('deleteRegolaError'));
    }
  };

  return (
    <>
      <LoadingButton
        loading={isLoading}
        size="small"
        sx={{
          width: '80px',
          height: '30px',
          minWidth: '30px'
        }}
        variant="outlined"
        onClick={open}
      >
        {dictionary.get('deleteRegola')}
      </LoadingButton>

      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={close}
        title={dictionary.get('deleteRegolaTitle')}
      >
        <ConfirmDialog
          message={dictionary.get('confirmDeleteRegola')}
          cancelString={dictionary.get('annulla')}
          confirmString={dictionary.get('procedi')}
          onConfirm={onDeleteRegola}
        />
      </Dialog>
    </>
  );
};
