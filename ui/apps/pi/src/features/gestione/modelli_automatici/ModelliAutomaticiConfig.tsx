import { useEffect } from 'react';
import { useRouter } from 'next/router';
import TableExternalHeader from "@cmrc/ui/components/Table/TableExternalHeader";
import { useGetQueryModelliConfig } from "./hooks/useDataModelliConfig";
import { dictionary } from "./dictionary";
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Pagination from '../../../components/Pagination';
import EnhancedTable from '../../../components/NewTable';
import { useModelliAutomaticiTable } from './hooks/useModelliAutomaticiTable';
import { SortingState } from '@tanstack/react-table';
import { FiltriListaModelli } from './filters/FiltriListaModelli';
import { AddModello } from './buttons/AddButton';

export const ModelliAutomaticiConfig = () => {
  const { query, isReady } = useRouter();
  const { columns, clearTable, setPage, setSearch, setSort } = useModelliAutomaticiTable();
  const { data, isLoading, isFetching } = useGetQueryModelliConfig();

  useEffect(() => {
    if (!isReady) return;

    setSearch(String(query?.search || ''));
    setPage(Number(query?.page) || 0);
  }, [isReady]);

  useEffect(() => () => {
    clearTable();
  }, []);

  return (
    <>
      <TableExternalHeader
        title={dictionary.get('headerTitle')}
        rightElement={<AddModello />}
      />
        <TableTopBar
          leftElement={<FiltriListaModelli loading={isLoading} />}
          rightElement={
            <Pagination
              table_id="modelliAutomaticiTable"
              count={data?.searchModelliAutomatici?.pageCount} />
          }
        />
        <EnhancedTable
          columns={columns}
          data={data?.searchModelliAutomatici?.modelloAutomaticoList}
          loading={isLoading || isFetching}
          emptyTableText={dictionary.get('tabellaVuotaModelliAutomatici')}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'modelliAutomaticiTable', sort })
          }}
        />
    </>
  );
};