import TableTopBar from '@cmrc/ui/components/TableTopBar';
import { useState } from 'react';
import { useOffice } from '@cmrc/auth/useOffice';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import { SortingState } from '@tanstack/react-table';
import { dictionary } from '../dictionary';
import { useAnagraficaTable } from '../hooks/useAnagraficaTable';
import { PaginationAnagraficaList } from './PaginationAnagraficaList';
import { SearchBarAnagraficaList } from './SearchBarAnagraficaList';
import { useGetQueryAnagraficaList } from '../hooks/useDataAnagraficaList';
import { VisualizzaContatto } from '../buttons/table_buttons/VisualizzaContatto';
import { TopbarAnagraficaList } from './TopbarAnagraficaList';
import EnhancedTable from '../../../../../components/NewTable';

export const AnagraficaList = () => {
  const { columns, setSort } = useAnagraficaTable();
  const { data, isLoading, isFetching } = useGetQueryAnagraficaList();
  const [selectedRow, setSelectedRow] = useState(null)
  const { isUserProtocollatore, isUserArchivista, isUserPIAdmin, isPiUser } = useOffice()

  const handleRowClick = (original) => {
    // Il click sulla riga per visualizzare il dettaglio è abilitato solo se l'utente è protocollatore/archivista dell'ufficio selezionato
    if (!isUserPIAdmin && (isUserArchivista || isUserProtocollatore || isPiUser))
      setSelectedRow(original);
  };

  return (
    <>
      <TableExternalHeader
        title={dictionary.get('headerTitle')}
        rightElement={<TopbarAnagraficaList />}
      />
      <TableTopBar
        leftElement={<SearchBarAnagraficaList />}
        rightElement={<PaginationAnagraficaList />}
      />
      <EnhancedTable
        onRowClick={({ original }) => handleRowClick(original)}
        columns={columns}
        data={data?.getAllAnagrafica?.anagraficaList}
        loading={isLoading || isFetching}
        emptyTableText={dictionary.get('tabellaVuotaAnagrafica')}
        defaultSort={[{ id: 'ragioneSociale', desc: false }]}
        onSort={(sort: SortingState) => {
          setSort({ table_id: 'anagrafica', sort })
        }}
      />
      {selectedRow && (
        <VisualizzaContatto contatto={selectedRow}
          onDrawerClose={() => { setSelectedRow(null) }} />
      )}
    </>
  );
};