import { createContext, useContext } from 'react';
import { RicercaAnagraficaDtoInput, useGetAllAnagraficaQuery } from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';
import { useTable } from '../../../../../store/table/useTable';

const GetAnagraficaListContext = createContext<ReturnType<typeof useGetAllAnagraficaQuery>>(null);

export const GetAnagraficaListProvider: FCC<{ children, idGruppo?: number }> = ({
  idGruppo,
  children
}) => {
  const { tableData } = useTable({
    table_id: 'anagrafica'
  });

  const ricercaAnagrafica: RicercaAnagraficaDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    cdr: undefined,
    gruppoId: idGruppo || null
  }

  const query = useGetAllAnagraficaQuery({
    ricercaAnagraficaDTO: ricercaAnagrafica
  }
  );

  return (
    <GetAnagraficaListContext.Provider value={query}>
      {children}
    </GetAnagraficaListContext.Provider>
  );
};

export const useGetQueryAnagraficaList = () => useContext(GetAnagraficaListContext);
