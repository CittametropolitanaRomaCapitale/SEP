import { createContext, useContext } from 'react';
import {
  RicercaPecEscluseRispostaAutomaticaDtoInput,
  useGetPecEscluseListQuery
} from '@cmrc/services/src/app/piapi/generated';
import { FCC } from '@cmrc/types/FCC';
import { useTable } from '../../../../../../store/table/useTable';

const GetPecEscluseRispostaAutomaticaListContext =
  createContext<ReturnType<typeof useGetPecEscluseListQuery>>(null);

export const GetPecEscluseRispostaAutomaticaListProvider: FCC = ({
  children
}) => {
  const { tableData } = useTable({
    table_id: 'configurazioniPecEscluseRispostaAutomatica'
  });

  const ricerca: RicercaPecEscluseRispostaAutomaticaDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    cdr: tableData?.filters?.cdr || undefined
  };

  const query = useGetPecEscluseListQuery({
    searchPecEscluse: ricerca
  });

  return (
    <GetPecEscluseRispostaAutomaticaListContext.Provider value={query}>
      {children}
    </GetPecEscluseRispostaAutomaticaListContext.Provider>
  );
};

export const useGetQueryPecEscluseList = () =>
  useContext(GetPecEscluseRispostaAutomaticaListContext);
