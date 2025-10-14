import { FCC } from '@cmrc/types/FCC';
import { Dispatch, SetStateAction, useEffect } from 'react';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { AllegatoBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { SortingState } from '@tanstack/react-table';
import { useListaDocumentiFascicoloTable } from './hooks/useListaDocumentiFascicoloTable';
import SearchDocumentiFascicolo from './SearchDocumentiFascicolo';
import { PaginationDocumentiFascicolo } from './PaginationDocumentiFascicolo';
import { dictionary } from './dictionary';
import { useGetDocumentiTitolarioListQuery } from './hooks/useDataDocumentiFascicolo';
import EnhancedTable from '../../../../components/NewTable';

interface ListaDocumentiFascicoloProps {
  setSelectedDocumenti?: Dispatch<SetStateAction<AllegatoBaseFragment[]>>
  disabled?: boolean;
}

export const ListaDocumentiFascicolo: FCC<ListaDocumentiFascicoloProps> = ({ setSelectedDocumenti, disabled }) => {
  const { data, isLoading, isFetching } = useGetDocumentiTitolarioListQuery();
  const { columns, clearTable, setSelectedRows, setSort } = useListaDocumentiFascicoloTable(disabled);

  const handleOnSelectedRow = (row) => {
    setSelectedRows(row)
    setSelectedDocumenti(row.map((selectedItem: AllegatoBaseFragment) => selectedItem))
  }

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    }, []
  );

  return (
    <Card sx={{ padding: 0, minHeight: '400px' }}>
      <Grid sx={{ width: '100%', height: '100%' }}>
        <TableTopBar
          leftElement={<SearchDocumentiFascicolo />}
          rightElement={<PaginationDocumentiFascicolo pagecount={data?.getAllegati?.pageCount} />}
        />
        <EnhancedTable
          columns={columns}
          data={data?.getAllegati?.allegati}
          loading={isLoading || isFetching}
          onSelectRow={(row) => handleOnSelectedRow(row)}
          emptyTableText={dictionary.get('tabellaVuotaTesto')}
          selectable={!disabled}
          disabledCheckbox={data?.getAllegati?.allegati?.length === 0}
          defaultSort={[{ id: 'tsCreation', desc: true }]}
          sx={{ height: '100%' }}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'listaDocumentiFascicolo', sort })
          }}
        />
      </Grid>
    </Card>
  );
}; 
