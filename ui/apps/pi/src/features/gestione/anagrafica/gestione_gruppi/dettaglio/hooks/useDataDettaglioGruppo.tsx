import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { useDettaglioGruppoQuery } from '@cmrc/services/src/app/piapi/generated';

const GetDataDettaglioGruppoContext = createContext<ReturnType<typeof useDettaglioGruppoQuery>>(null);

export const GetDataDettaglioGruppoProvider: FCC<{ idGruppo: number }> = ({
  idGruppo,
  children
}) => {

  const query = useDettaglioGruppoQuery({
    groupId: idGruppo,
  },
    { skip: !idGruppo }
  );

  return (
    <GetDataDettaglioGruppoContext.Provider value={query}>
      {children}
    </GetDataDettaglioGruppoContext.Provider>
  );
};

export const useGetQueryDettaglioGruppo = () => useContext(GetDataDettaglioGruppoContext);