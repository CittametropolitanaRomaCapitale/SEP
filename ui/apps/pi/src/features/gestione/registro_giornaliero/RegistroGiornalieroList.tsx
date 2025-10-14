import { Card, Grid, Stack } from '@mui/material';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import { useEffect } from 'react';
import { SortingState } from '@tanstack/react-table';
import { useRegistroGiornalieroTable } from './hooks/useRegistroGiornalieroTable';
import { useGetQueryRegistroGiornalieroList } from './hooks/useDataRegistroGiornalieroList';
import { dictionary } from './dictionary';
import { PaginationRegistroGiornalieroList } from './PaginationRegistroGiornalieroList';
import { SearchBarRegistroGiornalieroList } from './SearchBarRegistroGiornalieroList';
import { FiltriRegistroGiornaliero } from './FiltriRegistroGiornaliero';
import EnhancedTable from '../../../components/NewTable';

export const RegistroGiornalieroList = () => {
  const { columns, setFilters, setSort } = useRegistroGiornalieroTable();
  const { data, isLoading, isFetching } = useGetQueryRegistroGiornalieroList();

  useEffect(() => {
    setFilters({
      dataRegistroFrom: null,
      dataRegistroTo: null
    });
  }, [])

  return (
    <Card sx={{ padding: 0 }}>
      <Grid sx={{ width: 1 }}>
        <TableTopBar
          rightElement={<PaginationRegistroGiornalieroList />}
          leftElement={
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <FiltriRegistroGiornaliero loading={isLoading} />
              <SearchBarRegistroGiornalieroList />
            </Stack>
          }
        />
        <EnhancedTable
          columns={columns}
          data={data?.getRegistroGiornaliero?.registri}
          loading={isLoading || isFetching}
          emptyTableText={dictionary.get('tabellaVuotaRegistroGiornaliero')}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'registroGiornaliero', sort })
          }}
        />
      </Grid>
    </Card>
  );
};