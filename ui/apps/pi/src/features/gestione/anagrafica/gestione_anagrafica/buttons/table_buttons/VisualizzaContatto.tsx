import { FCC } from '@cmrc/types/FCC';
import Drawer from '@cmrc/ui/components/Drawer';
import { AnagraficaDto } from '@cmrc/services/src/app/piapi/generated';
import { useEffect } from 'react';
import { AnagraficaDrawer } from '../../components/AnagraficaDrawer';
import { dictionary } from '../dictionary';
import { useDrawer } from '../../../../../../store/drawer/useDrawer';

export const VisualizzaContatto: FCC<{ contatto?: AnagraficaDto, onDrawerClose?: any }> = ({
  contatto,
  onDrawerClose
}) => {
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: `visualizzaContatto_${contatto?.id}`
  });

  useEffect(() => {
    if (contatto)
      openDrawer()
  }, ([contatto]))

  const handleClose = () => {
    closeDrawer()
    onDrawerClose?.()
  }

  return (
    <Drawer
      title={dictionary.get('dettagliContatto')}
      onClose={handleClose}
      open={isOpenDrawer}
    >
      <AnagraficaDrawer data={contatto} readMode from='anagrafica' />
    </Drawer>
  );
};
