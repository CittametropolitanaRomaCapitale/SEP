import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { FCC } from '@cmrc/types/FCC';
import Drawer from '@cmrc/ui/components/Drawer';
import { PecPeo } from '@cmrc/services/src/app/piapi/generated';
import { PecPeoDrawer }  from '../../pec_peo/PecPeoDrawer';
import { useDrawer } from '../../../../../../../store/drawer/useDrawer';
import { dictionary } from '../dictionary';

export const UpdatePecPeoButton: FCC<{ configurazione?: PecPeo }> = ({
    configurazione
}) => {
    const { isOpenDrawer, openDrawer, closeDrawer } = useDrawer({
        drawer_id: `PecPeo_${configurazione?.id}`
      });

  return (
    <>
      <Button
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        onClick={openDrawer}
      >
        <EditIcon titleAccess={dictionary.get('modificaPecPeo')}/>
      </Button>

      <Drawer
        title={dictionary.get('modificaPecPeo')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <PecPeoDrawer data={configurazione} />
      </Drawer>
    </>
  );
};
