import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { FCC } from '@cmrc/types/FCC';
import Dialog from '@cmrc/ui/components/Dialog';
import {
  Tag,
  useDeleteTagMutation
} from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import ConfirmDialog from '../../../../../../../components/ConfirmDialog';
import { useDialog } from '../../../../../../../store/dialog/useDialog';
import { useGetQueryTagList } from '../../hooks/useDataTag';
import { dictionary } from '../../dictionary';

type DeleteTagButtonProps = {
  tagSelected: Tag;
};

export const DeleteTagButton: FCC<DeleteTagButtonProps> = ({ tagSelected }) => {
  const { open, close, isOpen } = useDialog({
    dialog_id: `deleteTag_${tagSelected?.id}`
  });
  const { refetch } = useGetQueryTagList();
  const [deleteTag, { isLoading }] = useDeleteTagMutation();

  const onDeleteTag = async () => {
    const response = await deleteTag({ id: tagSelected?.id }).unwrap();
    if (response?.deleteTag) {
      toast.success(dictionary.get('successEliminazione'));
      refetch();
    }
  };

  return (
    <>
      <LoadingButton
        loading={isLoading}
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        onClick={open}
      >
        <DeleteIcon titleAccess={dictionary.get('eliminaTag')} />
      </LoadingButton>

      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={close}
        title={dictionary.get('eliminaTag')}
      >
        <ConfirmDialog
          message={dictionary.get('confermaEliminaTag', {
            title: `"${tagSelected?.nome}"`
          })}
          cancelString={dictionary.get('annulla')}
          confirmString={dictionary.get('procedi')}
          onConfirm={onDeleteTag}
        />
      </Dialog>
    </>
  );
};
