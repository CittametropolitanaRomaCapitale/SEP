import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Dialog from '@cmrc/ui/components/Dialog';
import { useDialog } from '../../../../../store/dialog/useDialog';
import { dictionary } from '../dictionary';
import { RifiutaProtocollo } from '../RifiutaProtocollo';

export interface RifiutaProps {
  isDisabled:boolean,
  nProtocollo:string
}

export const Rifiuta: FCC<RifiutaProps> = ({ isDisabled, nProtocollo }) => {
  const { open, isOpen, close } = useDialog({
    dialog_id: `confermaRifiuta${nProtocollo}`
  });
  
  return (
    <>
      <Button
        onClick={open}
        disabled={isDisabled || isOpen}
        size="small"
        sx={{ mr: 1 }}
        variant="outlined"
      >
        {dictionary.get('rifiuta')}
      </Button>
      <Dialog open={isOpen} title={dictionary.get('rifiuta')} onClose={close}>
        <RifiutaProtocollo nProtocollo={nProtocollo} />
      </Dialog>
    </>
  );
}