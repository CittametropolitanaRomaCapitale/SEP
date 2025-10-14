import { createContext, useContext } from 'react';
import { RicercaConfigPedtoInput, useGetPecPeoConfigurationsQuery } from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';
import { useTable } from '../../../../../store/table/useTable';

const GetPecPeoListContext = createContext<ReturnType<typeof useGetPecPeoConfigurationsQuery>>(null);

export const GetPecPeoListProvider: FCC = ({ children }) => {
  const { tableData } = useTable({
    table_id: 'configurazioniPecPeo'
  });
  
  const ricerca:RicercaConfigPedtoInput = {
    search: tableData?.search || undefined,
    page:  tableData?.page || 0,
    size: 5,
    sort: tableData?.sort || undefined,
    cdr: tableData?.filters?.cdr || undefined,
    tipologiaPosta: tableData?.filters?.tipologiaPosta || undefined 
  }

  const query = useGetPecPeoConfigurationsQuery({
    RicercaConfigPEDTOInput: ricerca
    }
  );

  return (
    <GetPecPeoListContext.Provider value={query}>
      {children}
    </GetPecPeoListContext.Provider>
  );
};

export const useGetQueryPecPeoList = () => useContext(GetPecPeoListContext);
