import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { RicercaGruppiDtoInput, useGetAllGruppiQuery } from '@cmrc/services/src/app/piapi/generated';
import { useTable } from '../../../../../../store/table/useTable';

const GetGruppiListContext = createContext<ReturnType<typeof useGetAllGruppiQuery>>(null);

export const GetGruppiListProvider: FCC = ({ children }) => {
  const { tableData } = useTable({
    table_id: 'gruppi'
  });

  const ricercaGruppi: RicercaGruppiDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    cdr: undefined,
  }

  const query = useGetAllGruppiQuery({
    ricercaGruppiDTO: ricercaGruppi
  }
  );

  return (
    <GetGruppiListContext.Provider value={query}>
      {children}
    </GetGruppiListContext.Provider>
  );
};

export const useGetQueryGruppiList = () => useContext(GetGruppiListContext);
