import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { FCC } from '@cmrc/types/FCC';
import Drawer from '@cmrc/ui/components/Drawer';
import { PecEscluseRispostaAutomaticaDrawer } from '../../pec_escluse_risposta_automatica/PecEscluseRispostaAutomaticaDrawer';
import { useDrawer } from '../../../../../../../store/drawer/useDrawer';
import { dictionary } from '../../dictionary';
import { PecEscluseRispostaAutomatica } from '@cmrc/services/src/app/piapi/generated';

type UpdatePecEsclusaButtonProps = {
  pecEsclusaSelected: PecEscluseRispostaAutomatica;
};

export const UpdatePecEsclusaButton: FCC<UpdatePecEsclusaButtonProps> = ({
  pecEsclusaSelected
}) => {
  const { isOpenDrawer, openDrawer, closeDrawer } = useDrawer({
    drawer_id: `pecEscluseRispostaAutomaticaDrawer_${pecEsclusaSelected?.id}`
  });

  return (
    <>
      <Button
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        onClick={openDrawer}
      >
        <EditIcon titleAccess={dictionary.get('modificaPecEsclusa')} />
      </Button>

      <Drawer
        title={dictionary.get('modificaPecEsclusa')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <PecEscluseRispostaAutomaticaDrawer
          pecEsclusaSelected={pecEsclusaSelected}
        />
      </Drawer>
    </>
  );
};
