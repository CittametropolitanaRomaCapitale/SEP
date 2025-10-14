import { createContext, useContext } from 'react';
import { RicercaRegistiGiornalieriDtoInput, useGetRegistroGiornalieroQuery } from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';
import { formatDate } from '@cmrc/ui/utils/formatters';
import { useTable } from '../../../../store/table/useTable';

const GetRegistroGiornalieroListContext = createContext<ReturnType<typeof useGetRegistroGiornalieroQuery>>(null);

export const GetRegistroGiornalieroListProvider: FCC = ({ children }) => {
  const { tableData } = useTable({
    table_id: 'registroGiornaliero'
  });

  const ricercaRegistroGiornaliero: RicercaRegistiGiornalieriDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    cdr: undefined,
    dataRegistroFrom: tableData?.filters?.dataRegistroFrom ? formatDate({ date: tableData?.filters?.dataRegistroFrom, formatString: "yyyy-MM-dd'T'HH:mm:ss" }) : undefined,
    dataRegistroTo: tableData?.filters?.dataRegistroTo ? formatDate({ date: tableData?.filters?.dataRegistroTo, formatString: "yyyy-MM-dd'T'HH:mm:ss" }) : undefined
  }

  const query = useGetRegistroGiornalieroQuery({
    ricercaRegistroDTO: ricercaRegistroGiornaliero
  }
  );

  return (
    <GetRegistroGiornalieroListContext.Provider value={query}>
      {children}
    </GetRegistroGiornalieroListContext.Provider>
  );
};

export const useGetQueryRegistroGiornalieroList = () => useContext(GetRegistroGiornalieroListContext);
