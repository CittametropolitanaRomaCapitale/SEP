
import Button from '@mui/material/Button';
import Drawer from '@cmrc/ui/components/Drawer';
import { PecPeoDrawer } from '../pec_peo/PecPeoDrawer';
import { useDrawer } from '../../../../../../store/drawer/useDrawer';
import { dictionary } from './dictionary';

export const AddPecPeo = () => {
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: 'pecPeoDrawer'
  });

  return (
    <>
      <Button onClick={openDrawer} size="small" variant="contained">
        {dictionary.get('aggiungi')}
      </Button>

      <Drawer
        title={dictionary.get('aggiungiPecPeo')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <PecPeoDrawer />
      </Drawer>
    </>
  );
};
