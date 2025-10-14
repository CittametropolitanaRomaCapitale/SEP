import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Dialog from '@cmrc/ui/components/Dialog';
import { useDialog } from '../../../../../store/dialog/useDialog';
import { dictionary } from '../dictionary';
import { RichiediAssegnazioneProtocollo } from '../RichiediAssegnazioneProtocollo';

export interface RichiediAssegnazioneProps {
  idProtocollo:BigInteger,
  nProtocollo:string
}

export const RichiediAssegnazione: FCC<RichiediAssegnazioneProps> = ({ idProtocollo, nProtocollo }) => {
  const { open, isOpen, close } = useDialog({
    dialog_id: `confermaRichiediAssegnazione${nProtocollo}`
  });
  
  return (
    <>
      <Button
        onClick={open}
        disabled={isOpen}
        size="small"
        sx={{ mr: 1 }}
        variant="outlined"
      >
        {dictionary.get('richiediAssegnazione')}
      </Button>
      <Dialog open={isOpen} title={dictionary.get('richiediAssegnazione')} onClose={close}>
        <RichiediAssegnazioneProtocollo idProtocollo={idProtocollo} nProtocollo={nProtocollo} />
      </Dialog>
    </>
  );
}