import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import {
  RicercaAllegatiDtoInput,
  useGetAllegatiDiscardedQuery
} from '@cmrc/services/src/app/piapi/generated';
import { useTable } from '../../../store/table/useTable';

const GetAllegatiDiscardedContext =
  createContext<ReturnType<typeof useGetAllegatiDiscardedQuery>>(null);

export type DataAllegatiDiscardedProviderProps = {
  idProtocollo: number;
};

export const GetDataAllegatiDiscardedProvider: FCC<
  DataAllegatiDiscardedProviderProps
> = ({ children, idProtocollo }) => {
  const { tableData } = useTable({
    table_id: 'allegati_discarded'
  });

  const ricercaAllegati: RicercaAllegatiDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    idProtocollo
  };

  const query = useGetAllegatiDiscardedQuery(
    { ricercaAllegatiDTO: ricercaAllegati },
    { skip: !idProtocollo }
  );

  return (
    <GetAllegatiDiscardedContext.Provider value={query}>
      {children}
    </GetAllegatiDiscardedContext.Provider>
  );
};

export const useGetAllegatiDiscardedListQuery = () =>
  useContext(GetAllegatiDiscardedContext);
