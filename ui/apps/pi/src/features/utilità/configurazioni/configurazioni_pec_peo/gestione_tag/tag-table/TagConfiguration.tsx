import { useEffect } from 'react';
import { useRouter } from 'next/router';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import { SortingState } from '@tanstack/react-table';
import Pagination from '../../../../../../components/Pagination';
import { useTagConfigurationTable } from './useTagConfigurationTable';
import { AddTag } from './table-buttons/AddTag';
import { FiltriListaTag } from './filtri/FiltriListaTag';
import { useGetQueryTagList } from '../hooks/useDataTag';
import { dictionary } from '../dictionary';
import EnhancedTable from '../../../../../../components/NewTable';

export const TagConfiguration = () => {
  const { query, isReady } = useRouter();
  const { columns, clearTable, setPage, setSearch, setSort } =
    useTagConfigurationTable();
  const { data, isLoading, isFetching } = useGetQueryTagList();

  useEffect(() => {
    if (!isReady) return;
    setSearch(String(query?.search || ''));
    setPage(Number(query?.page) || 0);
  }, [isReady]);

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    },
    []
  );

  return (
    <>
      <TableExternalHeader
        title={dictionary.get('configurazioniTag')}
        rightElement={<AddTag />}
      />
      <TableTopBar
        leftElement={<FiltriListaTag />}
        rightElement={
          <Pagination
            table_id="configurazioniTag"
            count={data?.getTagList?.pageCount}
          />
        }
      />
      <EnhancedTable
        columns={columns}
        data={data?.getTagList?.tagList}
        loading={isLoading || isFetching}
        emptyTableText={dictionary.get('tabellaVuotaTag')}
        onSort={(sort: SortingState) => {
          setSort({ table_id: 'configurazioniTag', sort });
        }}
      />
    </>
  );
};
