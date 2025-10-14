import { useEffect } from "react";
import { useRouter } from "next/router";
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import { SortingState } from "@tanstack/react-table";
import { useTitolarioStoricoListTable } from './useTitolarioStoricoListTable';
import { useGetQueryStoricoList } from './hooks/useDataTitolarioStoricoList';
import { PaginazioneTitolarioStorico } from './PaginazioneTitolarioStorico';
import { dictionary } from './dictionary';
import EnhancedTable from "../../../../components/NewTable";

export const TitolarioStoricoList = () => {
  const { query, isReady } = useRouter();
  const { data, isLoading, isFetching } = useGetQueryStoricoList();
  const { columns, clearTable, setPage, setSort } = useTitolarioStoricoListTable();

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
          rightElement={<PaginazioneTitolarioStorico />}
        />
        <EnhancedTable
          columns={columns}
          data={data?.getStoricoTitolario?.logStorici}
          loading={isLoading || isFetching}
          emptyTableText={dictionary.get('storicoTabellaVuota')}
          // defaultSort={[{ id: 'tsCreation', desc: true }]}
          sx={{ height: '100%' }}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'storicoTitolario', sort })
          }}
        />
      </Grid>
    </Card>
  );
}