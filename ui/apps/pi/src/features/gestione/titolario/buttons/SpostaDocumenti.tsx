import { FCC } from '@cmrc/types/FCC';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from '@cmrc/ui/components/Toast';
import MoveDownRoundedIcon from '@mui/icons-material/MoveDownRounded';
import { TitolarioOutputDto, useSpostaAllegatiFascicoloMutation } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';
import { useSnackbar } from '../../../../store/snackbar/useSnackBar';

export type SpostaDocumentiProps = {
  disabled?: boolean;
  fascicoloOld: TitolarioOutputDto;
  fascicoloNew: TitolarioOutputDto;
  reset?: () => void;
  onItemUpdated?: (item: any) => void;
};

export const SpostaDocumenti: FCC<SpostaDocumentiProps> = ({ fascicoloOld, fascicoloNew, disabled, reset, onItemUpdated }) => {
  const { reset: resetSnackbar, currentMessageQueue } = useSnackbar({
    snackBarId: 'spostaDocumenti'
  });
  const [spostaDocumenti, { isLoading }] = useSpostaAllegatiFascicoloMutation();

  const onConfirm = async () => {
    try {
      const response = await spostaDocumenti({
        allegatiIds: currentMessageQueue.map((message) => message.id),
        oldTitolarioId: fascicoloOld?.id,
        newTitolarioId: fascicoloNew?.id
      }).unwrap();

      if (response?.spostaAllegatiFascicolo) {
        toast.success(dictionary.get('documentiSpostati'));
        reset();
        resetSnackbar();
        if (onItemUpdated) {
          onItemUpdated(fascicoloOld);
        }
      }

    } catch (e) {
      toast.error(dictionary.get('erroreSpostamentoDocumenti'));
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <LoadingButton
        loading={isLoading}
        onClick={onConfirm}
        disabled={disabled}
        size="small"
        variant='text'
        startIcon={<MoveDownRoundedIcon />}
      >
        {dictionary.get('spostaDocumenti')}
      </LoadingButton>
    </Box>
  );
};