import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { RicercaStoricoDtoInput, useGetStoricoRegistroGiornalieroQuery } from '@cmrc/services/src/app/piapi/generated';
import { useTable } from '../../../../../store/table/useTable';

const GetDataStoricoListContext = createContext<ReturnType<typeof useGetStoricoRegistroGiornalieroQuery>>(null);

export const GetDataStoricoRegistroGiornalieroListProvider: FCC<{ idRegistroGiornaliero: BigInteger }> = ({
  idRegistroGiornaliero,
  children
}) => {
  const { tableData } = useTable({
    table_id: 'storicoRegistroGiornaliero'
  });

  const dto: RicercaStoricoDtoInput = {
    page: tableData?.page || 0,
    size: 5,
    sort: tableData?.sort || undefined,
    cdr: undefined,
    idProtocollo: undefined,
    idRegistroGiornaliero
  };

  const query = useGetStoricoRegistroGiornalieroQuery({
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
