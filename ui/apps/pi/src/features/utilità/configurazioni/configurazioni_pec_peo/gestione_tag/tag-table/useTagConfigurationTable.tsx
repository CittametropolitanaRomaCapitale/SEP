import { Tag } from '@cmrc/services/src/app/piapi/generated';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import { TableTagConfigurationButtons } from './table-buttons/TableTagConfigurationButtons';

export const useTagConfigurationTable = () => {
  const { setSearch, setPage, setSort, clearTable } = useTable({
    table_id: 'configurazioniTag'
  });
  const columns: ColumnDef<Tag>[] = [
    {
      header: dictionary.get('nome'),
      accessorKey: 'nome'
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <TableTagConfigurationButtons tagSelected={original} />
      )
    }
  ];

  return {
    columns,
    setSearch,
    setPage,
    setSort,
    clearTable
  };
};
