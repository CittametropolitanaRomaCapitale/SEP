import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import {
  RicercaTitolarioDtoInput,
  useGetTitolarioQuery
} from '@cmrc/services/src/app/piapi/generated';
import { useRouter } from 'next/router';
import { useOffice } from '@cmrc/auth/useOffice';
import { useTable } from '../store/table/useTable';

const GetDataTitolarioContext =
  createContext<ReturnType<typeof useGetTitolarioQuery>>(null);

export type GetDataTitolarioProviderProps = RicercaTitolarioDtoInput & {
  showFascicoliChiusi: boolean;
  showFascicoliDeleted: boolean;
  hideFascicoliDeleted: boolean;
  showFascicoliForProtocolli: boolean;
  showFascicoliWithDocumenti: boolean;
  showFascicoliWithProtocolli: boolean;
  children: any;
  lastIdTitolario: any;
  startIndex: any;
};

export const GetDataTitolarioProvider: FCC<GetDataTitolarioProviderProps> = ({
  children,
  idPadre,
  lastIdTitolario,
  startIndex,
  showFascicoliChiusi,
  showFascicoliDeleted,
  hideFascicoliDeleted,
  showFascicoliForProtocolli,
  showFascicoliWithDocumenti,
  showFascicoliWithProtocolli
}) => {
  const { query: params } = useRouter();
  const { cdr, cdrCode } = useOffice();
  const { tableData } = useTable({
    table_id: 'ricercaTitolario'
  });

  const datiRicercaTitolario: RicercaTitolarioDtoInput = {
    search: tableData?.search,
    size: 50,
    page: tableData?.page || 0,
    lastIdTitolario: lastIdTitolario,
    startIndex: startIndex,
    showFascicoliChiusi,
    showFascicoliDeleted,
    hideFascicoliDeleted,
    showFascicoliWithDocumenti,
    showFascicoliWithProtocolli,
    showFascicoliForProtocolli,
    idPadre: idPadre ?? params?.idPadre,
    sort: { by: 'id', desc: false },
    cdrCode,
    cdr: [cdr]
  };

  const query = useGetTitolarioQuery({
    dto: datiRicercaTitolario
  });
 
  return (
    <GetDataTitolarioContext.Provider value={query}>
      {children}
    </GetDataTitolarioContext.Provider>
  );
};

export const useGetTitolarioList = () => useContext(GetDataTitolarioContext);
