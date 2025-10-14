import { useEffect } from "react";
import { useRouter } from "next/router";
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import { SortingState } from "@tanstack/react-table";
import { dictionary } from './dictionary';
import { useGetQueryStoricoList } from "./hooks/useDataRegistroGiornalieroStoricoList";
import { PaginationRegistroGiornalieroStorico } from "./PaginationRegistroGiornalieroStorico";
import { useRegistroGiornalieroStoricoTable } from "./hooks/useRegistroGiornalieroStoricoTable";
import EnhancedTable from "../../../../components/NewTable";

export const RegistroGiornalieroStoricoList = () => {
  const { query, isReady } = useRouter();
  const { data, isLoading, isFetching } = useGetQueryStoricoList();
  const { columns, clearTable, setPage, setSort } = useRegistroGiornalieroStoricoTable();

  useEffect(() => {
    if (!isReady) return;
    const { page } = query || {};
    setPage(Number(page) || 0);
  }, [isReady]);

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
          rightElement={<PaginationRegistroGiornalieroStorico />}
        />
        <EnhancedTable
          columns={columns}
          data={data?.getStoricoRegistroGiornaliero?.logStorici}
          loading={isLoading || isFetching}
          emptyTableText={dictionary.get('storicoTabellaVuota')}
          // defaultSort={[{ id: 'tsCreation', desc: true }]}
          sx={{ height: '100%' }}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'storicoRegistroGiornaliero', sort })
          }}
        />
      </Grid>
    </Card>
  );
}