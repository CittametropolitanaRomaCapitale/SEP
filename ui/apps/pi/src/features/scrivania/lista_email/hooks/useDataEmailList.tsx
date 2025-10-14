import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import {
  RicercaEmailDtoInput,
  useGetEmailsQuery
} from '@cmrc/services/src/app/piapi/generated';
import { useOffice } from '@cmrc/auth/useOffice';
import { useTable } from '../../../../store/table/useTable';
import {
  StatoAssegnazione,
  StatoClassificazione,
  StatoLavorazionePec
} from '../../../../utils/types';

const GetDataEmailListContext =
  createContext<ReturnType<typeof useGetEmailsQuery>>(null);

export const GetDataEmailListProvider: FCC = ({ children }) => {
  const { cdrCode } = useOffice();
  const { tableData } = useTable({
    table_id: 'listaEmail'
  });
  const datiRicercaEmail: RicercaEmailDtoInput = {
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || { by: 'tsInvio', desc: true },
    cdr: undefined,
    indirizziEmail: tableData?.filters?.indirizziEmail || undefined,
    isAssegnato: undefined,
    isClassificato: undefined,
    mostraNonLavorate: undefined,
    selectedCdr: cdrCode,
    tipoEmail: tableData?.filters?.advancedFilters?.tipoEmail || undefined,
    statoProtocollazione:
      tableData?.filters?.advancedFilters?.statoProtocollazione || undefined,
    statoInvio: tableData?.filters?.advancedFilters?.statoInvio || undefined,
    emailDirection:
      tableData?.filters?.advancedFilters?.emailDirection || undefined,
    dataInvioTo: tableData?.filters?.advancedFilters?.dataInvioTo || undefined,
    dataInvioFrom:
      tableData?.filters?.advancedFilters?.dataInvioFrom || undefined
  };

  if (
    tableData?.filters?.isClassificato !== undefined && 
    tableData?.filters?.isClassificato !== null &&
    tableData?.filters?.isClassificato.length == 1
  ) {
    datiRicercaEmail.isClassificato =
      tableData?.filters?.isClassificato[0] ===
      StatoClassificazione.CLASSIFICATO;
  }
  if (
    tableData?.filters?.isAssegnato !== undefined &&
    tableData?.filters?.isAssegnato !== null &&
    tableData?.filters?.isAssegnato.length == 1
  ) {
    datiRicercaEmail.isAssegnato =
      tableData?.filters?.isAssegnato[0] === StatoAssegnazione.ASSEGNATO;
  }
  if (
    tableData?.filters?.mostraNonLavorate !== undefined &&
    tableData?.filters?.mostraNonLavorate !== null &&
    tableData?.filters?.mostraNonLavorate.length == 1
  ) {
    datiRicercaEmail.mostraNonLavorate =
      tableData?.filters?.mostraNonLavorate[0] ===
      StatoLavorazionePec.NON_LAVORATE;
  }

  const query = useGetEmailsQuery({
    ricerca: datiRicercaEmail
  });

  return (
    <GetDataEmailListContext.Provider value={query}>
      {children}
    </GetDataEmailListContext.Provider>
  );
};

export const useGetQueryEmailList = () => useContext(GetDataEmailListContext);
