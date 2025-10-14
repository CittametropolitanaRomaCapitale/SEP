import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { useDettaglioTitolarioQuery } from '@cmrc/services/src/app/piapi/generated';

const GetDataDettaglioFascicoloContext = createContext<ReturnType<typeof useDettaglioTitolarioQuery>>(null);

export const GetDataDettaglioFascicoloProvider: FCC<{ idTitolario: number }> = ({
  idTitolario,
  children
}) => {

  const query = useDettaglioTitolarioQuery({
    idTitolario,
  },
    { skip: !idTitolario }
  );

  return (
    <GetDataDettaglioFascicoloContext.Provider value={query}>
      {children}
    </GetDataDettaglioFascicoloContext.Provider>
  );
};

export const useGetQueryDettaglioTitolario = () =>
  useContext(GetDataDettaglioFascicoloContext);
