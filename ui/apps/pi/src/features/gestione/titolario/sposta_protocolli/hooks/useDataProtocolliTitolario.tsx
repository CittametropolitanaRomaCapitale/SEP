import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { RicercaProtocolliDtoInput, TitolarioOutputDto, useGetProtocolliByFascicoloQuery } from '@cmrc/services/src/app/piapi/generated';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { useTable } from '../../../../../store/table/useTable';

const GetProtocolliTitolarioContext = createContext<ReturnType<typeof useGetProtocolliByFascicoloQuery>>(null);

export type DataProtocolliTitolarioProviderProps = {
  itemSelected: TitolarioOutputDto;
}

export const GetDataProtocolliTitolarioProvider: FCC<DataProtocolliTitolarioProviderProps> = (
  { children, itemSelected }
) => {
  const { user } = useAuth();
  const { tableData } = useTable({
    table_id: 'listaProtocolliFascicolo'
  });
  
  const datiRicercaProtocollo: RicercaProtocolliDtoInput = {
    filtroUfficio: false,
    search: tableData?.search || undefined,
    page: tableData?.page || 0,
    size: 8, 
    sort: tableData?.sort || undefined,
    cdr: [user?.selectedOffice?.office?.name],
    cdrCode: user?.selectedOffice?.office?.code || undefined,
    selectedOffice: user?.selectedOffice?.office?.code || undefined,
    idFascicolo: itemSelected?.id,
    stato: tableData?.filters?.stato || tableData?.filters?.advancedFilters?.advStato,
    numero: tableData?.filters?.nProtocollo || tableData?.filters?.advancedFilters?.nProtocollo,
    oggetto: tableData?.filters?.oggetto || tableData?.filters?.advancedFilters?.oggetto,
    mittente: tableData?.filters?.mittente || tableData?.filters?.advancedFilters?.mittente,
    tipoRegistrazione: tableData?.filters?.tipoRegistrazione || tableData?.filters?.advancedFilters?.advTipoRegistrazione,
    metodoSpedizione: tableData?.filters?.metodoSpedizione || tableData?.filters?.advancedFilters?.advMetodoSpedizione,
    note: tableData?.filters?.advancedFilters?.note,
    assegnatari: tableData?.filters?.advancedFilters?.assegnatari,
    destinatari: tableData?.filters?.advancedFilters?.destinatari,
    ricercaAvanzata: tableData?.filters?.isRicercaAvanzata || false,
    filtroAll: false
  };

  const query = useGetProtocolliByFascicoloQuery({
    ricerca_protocolli: datiRicercaProtocollo,
  }
  );

  return (
    <GetProtocolliTitolarioContext.Provider value={query}>
      {children}
    </GetProtocolliTitolarioContext.Provider>
  );
};

export const useGetProtocolliByFascicoloListQuery = () =>
  useContext(GetProtocolliTitolarioContext);
