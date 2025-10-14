import { createContext, useContext } from 'react';
import { RicercaRaccomandataDtoInput, useCercaRaccomandateQuery } from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';
import { useTable } from '../../../../store/table/useTable';

const GetRaccomandateProtocolloListListContext = createContext<ReturnType<typeof useCercaRaccomandateQuery>>(null);

export const GetRaccomandateProtocolloListListProvider: FCC<{ children, idProtocollo }> = ({
  children,
  idProtocollo
}) => {
  const { tableData } = useTable({
    table_id: 'raccomandateProtocollo'
  });

  const ricercaRaccomandateProtocolloList: RicercaRaccomandataDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    cdr: undefined,
    idProtocollo: idProtocollo || undefined,
    stato: tableData?.filters?.stato?.toString() || undefined
  }

  const query = useCercaRaccomandateQuery({
    ricercaRaccomandate: ricercaRaccomandateProtocolloList
  });

  return (
    <GetRaccomandateProtocolloListListContext.Provider value={query}>
      {children}
    </GetRaccomandateProtocolloListListContext.Provider>
  );
};

export const useGetQueryRaccomandateProtocolloList = () => useContext(GetRaccomandateProtocolloListListContext);
