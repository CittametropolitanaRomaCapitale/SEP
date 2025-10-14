import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import {
  RicercaProtocolliDtoInput,
  useGetProtocolliQuery
} from '@cmrc/services/src/app/piapi/generated';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { useOffice } from '@cmrc/auth/useOffice';
import { useTable } from '../../../../store/table/useTable';

const GetDataProtocolliListContext =
  createContext<ReturnType<typeof useGetProtocolliQuery>>(null);

export const GetDataProtocolliListProvider: FCC = ({ children }) => {
  const { user } = useAuth();
  const { isUserPIAdmin } = useOffice();
  const { tableData } = useTable({
    table_id: 'listaProtocolli'
  });

  const datiRicercaProtocollo: RicercaProtocolliDtoInput = {
    filtroUfficio: tableData?.filters?.filtro === 'IL_MIO_UFFICIO' || false,
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    cdr: tableData?.filters?.advancedFilters?.cdr || undefined,
    tagList: tableData?.filters?.advancedFilters?.tagList || undefined,
    selectedOffice: user?.selectedOffice?.office?.code || undefined,
    stato:
      tableData?.filters?.stato ||
      tableData?.filters?.advancedFilters?.advStato,
    numero:
      tableData?.filters?.nProtocollo ||
      tableData?.filters?.advancedFilters?.nProtocollo,
    numeroEmergenza:
      tableData?.filters?.nProtocolloEmergenza ||
      tableData?.filters?.advancedFilters?.nProtocolloEmergenza,
    oggetto:
      tableData?.filters?.oggetto ||
      tableData?.filters?.advancedFilters?.oggetto,
    dataCreazioneFrom:
      tableData?.filters?.dataCreazioneFrom ||
      tableData?.filters?.advancedFilters?.dataCreazioneFrom,
    dataCreazioneTo:
      tableData?.filters?.dataCreazioneTo ||
      tableData?.filters?.advancedFilters?.dataCreazioneTo,
    dataCreazioneEmergenzaFrom:
      tableData?.filters?.dataCreazioneEmergenzaFrom ||
      tableData?.filters?.advancedFilters?.dataCreazioneEmergenzaFrom,
    dataCreazioneEmergenzaTo:
      tableData?.filters?.dataCreazioneEmergenzaTo ||
      tableData?.filters?.advancedFilters?.dataCreazioneEmergenzaTo,
    mittente:
      tableData?.filters?.mittente ||
      tableData?.filters?.advancedFilters?.mittente,
    tipoRegistrazione:
      tableData?.filters?.tipoRegistrazione ||
      tableData?.filters?.advancedFilters?.advTipoRegistrazione,
    metodoSpedizione:
      tableData?.filters?.metodoSpedizione ||
      tableData?.filters?.advancedFilters?.advMetodoSpedizione,
    note: tableData?.filters?.advancedFilters?.note,
    assegnatari: tableData?.filters?.advancedFilters?.assegnatari,
    destinatari: tableData?.filters?.advancedFilters?.destinatari,
    ricercaAvanzata: tableData?.filters?.isRicercaAvanzata || false,
    filtroAll: (isUserPIAdmin && tableData?.filters?.filtro === 'ALL') || false,
    nomeTitolario:
      tableData?.filters?.advancedFilters?.classificazione || undefined,
    idFascicoli:
      tableData?.filters?.advancedFilters?.idTitolario?.map(
        (item) => item.id
      ) || undefined
  };

  const query = useGetProtocolliQuery({
    ricercaProtocolliDTO: datiRicercaProtocollo
  });

  return (
    <GetDataProtocolliListContext.Provider value={query}>
      {children}
    </GetDataProtocolliListContext.Provider>
  );
};

export const useGetQueryProtocolliList = () =>
  useContext(GetDataProtocolliListContext);
