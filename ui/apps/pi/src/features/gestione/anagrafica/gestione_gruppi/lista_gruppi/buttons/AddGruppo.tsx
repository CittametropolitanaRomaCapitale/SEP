import Button from '@mui/material/Button';
import Drawer from '@cmrc/ui/components/Drawer';
import { useDrawer } from '../../../../../../store/drawer/useDrawer';
import { dictionary } from './dictionary';
import { GruppoDrawer } from '../components/GruppoDrawer';

export const AddGruppo = () => {
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: 'gruppoDrawer'
  });

  return (
    <>
      <Button onClick={openDrawer} size="small" variant="contained">
        {dictionary.get('aggiungi')}
      </Button>
      <Drawer
        title={dictionary.get('aggiungiGruppo')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <GruppoDrawer />
      </Drawer>
    </>
  );
};