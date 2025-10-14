import { createContext, useContext } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { RicercaProtocolliDtoInput, useGetProtocolliQuery } from '@cmrc/services/src/app/piapi/generated';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { useOffice } from '@cmrc/auth/useOffice';
import { useTable } from '../store/table/useTable';

const GetSearchProtocolliListContext = createContext<ReturnType<typeof useGetProtocolliQuery>>(null);

export const GetSearchProtocolliListProvider: FCC<{ children, initialData }> = ({ children, initialData }) => {
  const { tableData } = useTable({
    table_id: 'searchProtocolliList'
  });
  const { isUserPIAdmin } = useOffice();

  const { user } = useAuth()

  const datiRicercaProtocollo: RicercaProtocolliDtoInput = {
    search: undefined,
    page: tableData?.page || 0,
    size: 10,
    sort: tableData?.sort || undefined,
    cdr: undefined,
    anno: tableData?.filters?.anno || initialData?.anno,
    numero: tableData?.filters?.numero || initialData?.numero,
    oggetto: tableData?.filters?.oggetto || initialData?.oggetto,
    ricercaAvanzata: false,
    filtroUfficio: tableData?.filters?.filtro === 'IL_MIO_UFFICIO' || (!!initialData?.filtroUfficio),
    selectedOffice: user?.selectedOffice?.office?.code,
    filtroAll: (isUserPIAdmin && tableData?.filters?.filtro === 'ALL') || false,
  }

  const query = useGetProtocolliQuery({
    ricercaProtocolliDTO: datiRicercaProtocollo
  }
  );

  return (
    <GetSearchProtocolliListContext.Provider value={query}>
      {children}
    </GetSearchProtocolliListContext.Provider>
  );
};

export const useGetQuerySearchProtocolliList = () =>
  useContext(GetSearchProtocolliListContext);
