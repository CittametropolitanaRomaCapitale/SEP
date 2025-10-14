import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@cmrc/ui/components/Dialog';
import toast from '@cmrc/ui/components/Toast';
import { Anagrafica, useRemoveContactFromGroupMutation } from '@cmrc/services/src/app/piapi/generated';
import { useGetQueryAnagraficaList } from '../../../../../../gestione_anagrafica/hooks/useDataAnagraficaList';
import { useDialog } from '../../../../../../../../../store/dialog/useDialog';
import ConfirmDialog from '../../../../../../../../../components/ConfirmDialog';
import { useGetQueryDettaglioGruppo } from '../../../../hooks/useDataDettaglioGruppo';
import { dictionary } from '../dictionary';

export const EliminaContattoFromGruppoButton: FCC<{ contatto?: Anagrafica }> = ({
  contatto
}) => {
  const { isOpen, open, close } = useDialog({
    dialog_id: `confermaEliminaContatto_${contatto?.id}`
  })

  const { refetch } = useGetQueryAnagraficaList();
  const [deleteContattoFromgruppo] = useRemoveContactFromGroupMutation();
  const { data } = useGetQueryDettaglioGruppo()

  const onDeleteContattoFromGruppo = async () => {
    const response = await deleteContattoFromgruppo({ groupId: data?.dettaglioGruppo?.id, contactId: contatto?.id }).unwrap();
    if (response?.removeContactFromGroup) {
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
        <DeleteIcon titleAccess={dictionary.get('eliminaContatto')} />
      </Button>
      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={close}
        title={dictionary.get('eliminaContatto')}
      >
        <ConfirmDialog
          message={dictionary.get('confermaEliminazioneContatto')}
          cancelString={dictionary.get('annulla')}
          confirmString={dictionary.get('conferma')}
          onConfirm={onDeleteContattoFromGruppo}
        />
      </Dialog>
    </>
  );
};
