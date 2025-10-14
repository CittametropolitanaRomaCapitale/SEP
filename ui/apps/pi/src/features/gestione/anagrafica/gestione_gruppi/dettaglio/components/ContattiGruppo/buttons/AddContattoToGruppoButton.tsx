import Button from '@mui/material/Button';
import FullScreenDialog from '@cmrc/ui/components/FullScreenDialog';
import { useDialog } from '../../../../../../../../store/dialog/useDialog';
import { RicercaContattiCertificatiList } from '../RicercaContattiCertificatiList';
import { GetContattiCertificatiListProvider } from '../hooks/useDataContattiCertificatiList';
import { dictionary } from './dictionary';

export const AddContattoToGruppoButton = () => {
  const { isOpen, open, close } = useDialog({
    dialog_id: 'ricercaContattiCertificati'
  })

  return (
    <>
      <Button
        onClick={open}
        size="small"
        sx={{ mr: 1 }}
        variant="outlined"
        aria-label="aggiungi-contatto"
      >
        {dictionary.get('aggiungiContatto')}
      </Button>
      <FullScreenDialog
        open={isOpen}
        onClose={close}
        title={dictionary.get('aggiungiContatti')}
      >
        <GetContattiCertificatiListProvider>
          <RicercaContattiCertificatiList />
        </GetContattiCertificatiListProvider>
      </FullScreenDialog>
    </>
  );
};
