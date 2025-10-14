import { useEffect } from 'react';
import { useRouter } from 'next/router';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import { SortingState } from '@tanstack/react-table';
import Pagination from '../../../../../../components/Pagination';
import { usePecPeoConfigurationTable } from './usePecPeoConfigurationTable';
import { AddPecPeo } from './AdPecPeo';
import { FiltriListaPecPeo } from './filtri/FiltriListaPecPeo';
import { useGetQueryPecPeoList } from '../useDataPecPeo';
import { dictionary } from './dictionary';
import EnhancedTable from '../../../../../../components/NewTable';

export const PecPeoConfiguration = () => {
  const { query, isReady } = useRouter();
  const { columns, clearTable, setPage, setSearch, setSort } = usePecPeoConfigurationTable();
  const { data, isLoading, isFetching } = useGetQueryPecPeoList();

  useEffect(() => {
    if (!isReady) return;

    setSearch(String(query?.search || ''));
    setPage(Number(query?.page) || 0);
  }, [isReady]);

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    }, []
  );

  return (
    <>
      <TableExternalHeader
        title={dictionary.get('configurazioniPecPeo')}
        rightElement={
          <AddPecPeo />
        }
      />
      <TableTopBar
        leftElement={
          <FiltriListaPecPeo loading={isLoading} />
        }
        rightElement={
          <Pagination
            table_id="configurazioniPecPeo"
            count={data?.getConfigurations?.pageCount} />
        }
      />
      <EnhancedTable
        columns={columns}
        data={data?.getConfigurations?.configurazioniPostaElettronica}
        loading={isLoading || isFetching}
        emptyTableText={dictionary.get('tabellaVuotaPecPeo')}
        onSort={(sort: SortingState) => {
          setSort({ table_id: 'configurazioniPecPeo', sort })
        }}
      />
    </>
  );
};
