import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { RicercaStoricoDtoInput, useGetStoricoTitolarioQuery } from '@cmrc/services/src/app/piapi/generated';
import { useTable } from '../../../../../store/table/useTable';

const GetDataStoricoListContext = createContext<ReturnType<typeof useGetStoricoTitolarioQuery>>(null);

export const GetDataStoricoTitolarioListProvider: FCC<{ idTitolario: BigInteger }> = ({
  idTitolario,
  children
}) => {
  const { tableData } = useTable({
    table_id: 'storicoTitolario'
  });

  const dto: RicercaStoricoDtoInput = {
    page: tableData?.page || 0,
    size: 5,
    sort: tableData?.sort || undefined,
    cdr: undefined,
    idProtocollo: undefined,
    idTitolario
  };

  const query = useGetStoricoTitolarioQuery({
    ricercaStoricoDTO: dto
  }
  );

  return (
    <GetDataStoricoListContext.Provider value={query}>
      {children}
    </GetDataStoricoListContext.Provider>
  );
};

export const useGetQueryStoricoList = () =>
  useContext(GetDataStoricoListContext);
