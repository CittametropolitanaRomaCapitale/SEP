import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { RicercaPermessiVisibilitaDtoInput, useGetPermessiVisibilitaQuery } from '@cmrc/services/src/app/piapi/generated';
import { useTable } from '../../../../../store/table/useTable';

const GetDataPermessiFascicoloContext = createContext<ReturnType<typeof useGetPermessiVisibilitaQuery>>(null);

export const GetDataPermessiFascicoloProvider: FCC<{ idTitolario: number }> = ({
  idTitolario,
  children
}) => {
  const { tableData } = useTable({
    table_id: 'permessiFascicolo'
  });

  const inputRicerca: RicercaPermessiVisibilitaDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    idTitolario,
    cdrNames: tableData?.filters?.cdr || [],
    permesso: tableData?.filters?.permesso || undefined,
  };

  const query = useGetPermessiVisibilitaQuery({
    visibilitaDTO: inputRicerca
  }
  );

  return (
    <GetDataPermessiFascicoloContext.Provider value={query}>
      {children}
    </GetDataPermessiFascicoloContext.Provider>
  );
};

export const useGetQueryPermessiFascicolo = () =>
  useContext(GetDataPermessiFascicoloContext);
