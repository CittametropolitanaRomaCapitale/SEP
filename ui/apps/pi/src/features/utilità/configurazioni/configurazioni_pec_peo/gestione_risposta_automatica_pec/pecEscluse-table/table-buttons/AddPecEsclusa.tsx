import Button from '@mui/material/Button';
import Drawer from '@cmrc/ui/components/Drawer';
import { PecEscluseRispostaAutomaticaDrawer } from '../../pec_escluse_risposta_automatica/PecEscluseRispostaAutomaticaDrawer';
import { useDrawer } from '../../../../../../../store/drawer/useDrawer';
import { dictionary } from '../../dictionary';

export const AddPecEsclusa = () => {
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: 'pecEscluseRispostaAutomaticaDrawer'
  });

  return (
    <>
      <Button onClick={openDrawer} size="small" variant="contained">
        {dictionary.get('aggiungi')}
      </Button>

      <Drawer
        title={dictionary.get('aggiungiPecEsclusa')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <PecEscluseRispostaAutomaticaDrawer />
      </Drawer>
    </>
  );
};
