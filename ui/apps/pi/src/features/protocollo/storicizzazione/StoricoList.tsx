import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SortingState } from '@tanstack/react-table';
import { dictionary } from './dictionary';
import { useListaStoricoTable } from './useStoricoListTable';
import { useGetQueryStoricoList } from './hooks/useDataStoricoList';
import EnhancedTable from '../../../components/NewTable';

export const StoricoList = () => {
  const { query, isReady } = useRouter();
  const { data, isLoading, isFetching } = useGetQueryStoricoList();
  const { columns, clearTable, setPage, setSort } = useListaStoricoTable();

  useEffect(() => {
    if (!isReady) return;
    const { page } = query || {};
    setPage(Number(page) || 0);
  }, [isReady]);

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    },
    []
  );

  return (
    <EnhancedTable
      columns={columns}
      data={data?.getStoricoProtocollo?.logStorici}
      loading={isLoading || isFetching}
      emptyTableText={dictionary.get('storicoTabellaVuota')}
      // defaultSort={[{ id: 'tsCreation', desc: true }]}
      onSort={(sort: SortingState) => {
        setSort({ table_id: 'storicoProtocollo', sort });
      }}
    />
  );
};
