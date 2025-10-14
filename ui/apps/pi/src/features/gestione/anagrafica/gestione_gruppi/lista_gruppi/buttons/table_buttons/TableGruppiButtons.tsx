import { FCC } from '@cmrc/types/FCC';
import { Gruppo } from '@cmrc/services/src/app/piapi/generated';
import { ModificaGruppoButton } from './ModificaGruppoButton';
import { EliminaGruppoButton } from './EliminaGruppoButton';

export const TableGruppiButtons: FCC<{ gruppo?: Gruppo }> = ({
  gruppo
}) => (
  <>
    <ModificaGruppoButton gruppo={gruppo} />
    <EliminaGruppoButton gruppo={gruppo} />
  </>
);
