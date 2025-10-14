import { createContext, useContext } from 'react';
import {
  RicercaTagDtoInput,
  useGetTagListQuery
} from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';
import { useTable } from '../../../../../../store/table/useTable';

const GetTagListContext =
  createContext<ReturnType<typeof useGetTagListQuery>>(null);

export const GetTagListProvider: FCC = ({ children }) => {
  const { tableData } = useTable({
    table_id: 'configurazioniTag'
  });

  const ricerca: RicercaTagDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    cdr: tableData?.filters?.cdr || undefined
  };

  const query = useGetTagListQuery({
    searchTag: ricerca
  });

  return (
    <GetTagListContext.Provider value={query}>
      {children}
    </GetTagListContext.Provider>
  );
};

export const useGetQueryTagList = () => useContext(GetTagListContext);
