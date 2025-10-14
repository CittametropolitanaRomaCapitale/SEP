import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { RicercaAllegatiDtoInput, useGetAllegatiQuery } from '@cmrc/services/src/app/piapi/generated';
import { useTable } from '../../../store/table/useTable';

const GetAllegatiContext = createContext<ReturnType<typeof useGetAllegatiQuery>>(null);

export type DataAllegatiProtocolloProviderProps = {
  idProtocollo: number;
}

export const GetDataAllegatiProtocolloProvider: FCC<DataAllegatiProtocolloProviderProps> = (
  { children, idProtocollo }
) => {
  const { tableData } = useTable({
    table_id: 'allegati'
  });

  const ricercaAllegati: RicercaAllegatiDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    idProtocollo,
  };

  const query = useGetAllegatiQuery({
    ricercaAllegatiDTO: ricercaAllegati,
  },
    { skip: !idProtocollo }
  );

  return (
    <GetAllegatiContext.Provider value={query}>
      {children}
    </GetAllegatiContext.Provider>
  );
};

export const useGetAllegatiProtocolloListQuery = () =>
  useContext(GetAllegatiContext);
