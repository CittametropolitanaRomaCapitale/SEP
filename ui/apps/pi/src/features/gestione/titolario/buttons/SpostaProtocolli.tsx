import { FCC } from '@cmrc/types/FCC';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import toast from '@cmrc/ui/components/Toast';
import MoveDownRoundedIcon from '@mui/icons-material/MoveDownRounded';
import { TitolarioOutputDto, useSpostaProtocolloMutation } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';
import { useSnackbar } from '../../../../store/snackbar/useSnackBar';

export type SpostaProtocolliProps = {
  disabled?: boolean;
  fascicoloOld: TitolarioOutputDto;
  fascicoloNew: TitolarioOutputDto;
  reset?: () => void;
  onItemUpdated?: (item: any) => void;
};

export const SpostaProtocolli: FCC<SpostaProtocolliProps> = ({ fascicoloOld, fascicoloNew, disabled, reset, onItemUpdated }) => {
  const { reset: resetSnackbar, currentMessageQueue } = useSnackbar({
    snackBarId: 'spostaProtocolli'
  });
  const [spostaProtocolli] = useSpostaProtocolloMutation();
  
  const onConfirm = async () => {
    const response = await spostaProtocolli({
      idProtocolli: currentMessageQueue.map((message) => message.id),
      idFascicoloOld: fascicoloOld?.id,
      idFascicoloNew: fascicoloNew?.id
    }).unwrap();

    if (response?.spostaProtocollo) {
      toast.success(dictionary.get('protocolliSpostati'));
      reset();
      resetSnackbar();
      if (onItemUpdated) {
        onItemUpdated(fascicoloOld);
      }
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button onClick={onConfirm} disabled={disabled} size="small" variant='text' startIcon={<MoveDownRoundedIcon />}>
        {dictionary.get('spostaProtocolli')}
      </Button>
    </Box>
  );
};