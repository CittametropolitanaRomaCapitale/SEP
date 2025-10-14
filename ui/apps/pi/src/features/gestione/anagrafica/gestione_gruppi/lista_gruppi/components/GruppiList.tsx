import TableTopBar from '@cmrc/ui/components/TableTopBar';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import { useRouter } from 'next/router';
import { SortingState } from '@tanstack/react-table';
import { useGruppiTable } from '../hooks/useGruppiTable';
import { TopbarGruppiList } from './TopbarGruppiList';
import { SearchBarGruppiList } from './SearchBarGruppiList';
import { PaginationGruppiList } from './PaginationGruppiList';
import { dictionary } from '../../dictionary';
import { useGetQueryGruppiList } from '../hooks/useDataGruppiList';
import EnhancedTable from '../../../../../../components/NewTable';

export const GruppiList = () => {
  const { columns, setSort } = useGruppiTable();
  const { data, isLoading, isFetching } = useGetQueryGruppiList();
  const { push } = useRouter();

  const handleRowClick = (original) => {
    push({ pathname: '/anagrafica/gruppi' })
      .then(() => push(`/anagrafica/gruppi/${original?.id}`));
  };

  return (
    <>
      <TableExternalHeader
        title={dictionary.get('gruppi')}
        rightElement={<TopbarGruppiList />}
      />
      <TableTopBar
        leftElement={<SearchBarGruppiList />}
        rightElement={<PaginationGruppiList />}
      />
      <EnhancedTable
        onRowClick={({ original }) => handleRowClick(original)}
        columns={columns}
        data={data?.getAllGruppi?.gruppiList || []}
        loading={isLoading || isFetching}
        emptyTableText={dictionary.get('tabellaVuotaGruppi')}
        defaultSort={[{ id: 'nome', desc: false }]}
        onSort={(sort: SortingState) => {
          setSort({ table_id: 'gruppi', sort })
        }}
      />
    </>
  );
};
