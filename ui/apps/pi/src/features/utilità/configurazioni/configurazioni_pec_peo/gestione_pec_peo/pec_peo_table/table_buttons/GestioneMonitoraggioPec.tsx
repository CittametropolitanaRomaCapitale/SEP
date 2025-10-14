import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import { FCC } from '@cmrc/types/FCC';
import Drawer from '@cmrc/ui/components/Drawer';
import { PecPeo } from '@cmrc/services/src/app/piapi/generated';
import { MonitoraggioPecDrawer } from '../../pec_peo/MonitoraggioPecDrawer';
import { useDrawer } from '../../../../../../../store/drawer/useDrawer';
import { dictionary } from '../dictionary';
import { GetPecRegoleProvider } from '../../pec_peo/hooks/usaDataRegoleMonitoraggio';

export const GestioneMonitoraggioPec: FCC<{ configurazione?: PecPeo }> = ({
  configurazione
}) => {
  const { isOpenDrawer, openDrawer, closeDrawer } = useDrawer({
    drawer_id: `gestioneMonitoraggioPec_${configurazione?.id}`
  });

  return (
    <>
      <GetPecRegoleProvider idEmail={configurazione?.id}>
        <Button
          size="small"
          sx={{ width: '30px', height: '30px', minWidth: '30px' }}
          onClick={openDrawer}
        >
          <SettingsIcon titleAccess={dictionary.get('gestioneMonitoraggio')} />
        </Button>

        <Drawer
          title={dictionary.get('gestioneMonitoraggio')}
          onClose={closeDrawer}
          open={isOpenDrawer}
        >
          <MonitoraggioPecDrawer
            data={configurazione}
            closeDrawer={closeDrawer}
          />
        </Drawer>
      </GetPecRegoleProvider>
    </>
  );
};
