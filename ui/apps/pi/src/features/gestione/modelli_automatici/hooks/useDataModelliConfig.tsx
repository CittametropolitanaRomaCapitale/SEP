import { createContext, useContext } from 'react';
import { RicercaModelloAutomaticoDtoInput, useSearchModelliAutomaticiQuery } from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';
import { useTable } from '../../../../store/table/useTable';

const GetModelliAutomaticiConfigContext = createContext<ReturnType<typeof useSearchModelliAutomaticiQuery>>(null);

export const GetuseDataModelliAutomaticiConfigProvider: FCC = ({ children }) => {
  const { tableData } = useTable({
    table_id: 'modelliAutomaticiTable'
  });

  const ricerca:RicercaModelloAutomaticoDtoInput = {
    search: tableData?.search || undefined,
    page:  tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    cdr: tableData?.filters?.cdr || undefined,
  };

  const query = useSearchModelliAutomaticiQuery( { input: ricerca } );

  return (
    <GetModelliAutomaticiConfigContext.Provider value={query}>
      {children}
    </GetModelliAutomaticiConfigContext.Provider>
  );
};

export const useGetQueryModelliConfig = () => useContext(GetModelliAutomaticiConfigContext);
