import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { FCC } from '@cmrc/types/FCC';
import Drawer from '@cmrc/ui/components/Drawer';
import { Gruppo } from '@cmrc/services/src/app/piapi/generated';
import { GruppoDrawer } from '../../components/GruppoDrawer';
import { useDrawer } from '../../../../../../../store/drawer/useDrawer';
import { dictionary } from '../dictionary';

export const ModificaGruppoButton: FCC<{ gruppo?: Gruppo }> = ({
  gruppo
}) => {
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: `modificaGruppo_${gruppo?.id}`
  });

  return (
    <>
      <Button
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        onClick={openDrawer}
      >
        <EditIcon titleAccess={dictionary.get('modificaGruppo')} />
      </Button>

      <Drawer
        title={dictionary.get('modificaGruppo')}
        onClose={closeDrawer}
        open={isOpenDrawer}
      >
        <GruppoDrawer data={gruppo} />
      </Drawer>
    </>
  );
};
