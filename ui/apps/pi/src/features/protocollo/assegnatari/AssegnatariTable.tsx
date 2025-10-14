import { useEffect } from "react";
import { useRouter } from "next/router";
import { dictionary } from './dictionary';
import { useAssegnatariTable } from './useAssegnatariTable';
import { useGetQueryReferentiProtocollo } from './hooks/useDataReferentiProtocollo';
import EnhancedTable from '../../../components/NewTable';

export const AssegnatariTable = () => {
  const { query, isReady } = useRouter();
  const { data, isLoading, isFetching } = useGetQueryReferentiProtocollo();
  const { columns, clearTable, setPage } = useAssegnatariTable();

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
    <EnhancedTable
      columns={columns}
      data={data?.getReferenti?.referenti}
      loading={isLoading || isFetching}
      emptyTableText={dictionary.get('emptySearchTable')}
      defaultSort={[{ id: 'tsCreation', desc: true }]}
    />
  );
}