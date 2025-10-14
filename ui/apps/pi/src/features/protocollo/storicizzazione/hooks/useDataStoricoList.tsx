import { createContext, useContext, useMemo } from 'react';
import { FCC } from '@cmrc/types/FCC';
import {
  RicercaStoricoDtoInput,
  useGetStoricoProtocolloQuery
} from '@cmrc/services/src/app/piapi/generated';
import { useTable } from '../../../../store/table/useTable';

const GetDataStoricoListContext =
  createContext<ReturnType<typeof useGetStoricoProtocolloQuery>>(null);

type GetDataStoricoListProviderProps = {
  idProtocollo: bigint;
  cdrCode: string;
  isFilteredByCdr: boolean;
};

export const GetDataStoricoListProvider: FCC<
  GetDataStoricoListProviderProps
> = ({ idProtocollo, cdrCode, isFilteredByCdr, children }) => {
  const { tableData } = useTable({
    table_id: 'storicoProtocollo'
  });

  const dto: RicercaStoricoDtoInput = {
    page: tableData?.page || 0,
    size: 5,
    sort: tableData?.sort || undefined,
    cdr: undefined,
    idProtocollo: idProtocollo,
    cdrCode,
    isFilteredByCdr
  };

  const query = useGetStoricoProtocolloQuery({
    ricercaStoricoDTO: dto
  });

  return (
    <GetDataStoricoListContext.Provider value={query}>
      {children}
    </GetDataStoricoListContext.Provider>
  );
};

export const useGetQueryStoricoList = () =>
  useContext(GetDataStoricoListContext);
