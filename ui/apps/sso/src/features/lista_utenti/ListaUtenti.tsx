import { useEffect } from 'react';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import { SortingState } from '@tanstack/react-table';
import { dictionary } from './dictionary';
import { useListaUtentiTable } from './useListaUtentiTable';
import FiltriUtenti from './FiltriUtenti';
import Pagination from '../../components/Pagination';
import EnhancedTable from '../../components/EnhancedTable';

export const ListaUtenti = () => {
  const router = useRouter();
  const { data, tableProps, clearTable, setSort } = useListaUtentiTable();

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    },
    []
  );

  return (
    <Card sx={{ padding: 0 }}>
      <Grid sx={{ width: 1 }}>
        <TableTopBar
          leftElement={
              <FiltriUtenti loading={tableProps?.loading} />
          }
          rightElement={
            <Pagination table_id="listaUtenti" count={data?.pages} />
          }
        />
        <EnhancedTable
          onRowClick={({ original }) => router.push(`/utenti/${original.id}`)}
          emptyTableText={dictionary.get('tabellaVuotaTesto')}
          columns={tableProps.columns}
          data={tableProps.data}
          loading={tableProps.loading || tableProps.fet}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'listaUtenti', sort })
          }}
        />
      </Grid>
    </Card>
  );
};
