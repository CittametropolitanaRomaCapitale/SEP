import { AllegatoBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { bytesToSize } from '@cmrc/ui/utils/bytes-to-size';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import { TableDocumentiFascicoloButtons } from '../buttons/TableDocumentiFascicoloButtons';
import TooltipEllipsisLabel from '../../../../../components/TooltipEllipsisLabel';

export const useListaDocumentiFascicoloTable = (disabled?: boolean) => {
  const { tableData, setSort, clearTable, setPage, setSearch, setFilters, setSelectedRows } = useTable({
    table_id: 'listaDocumentiFascicolo'
  });

  const columns: ColumnDef<AllegatoBaseFragment>[] = [
    {
      accessorKey: 'nome',
      header: dictionary.get('nomeFile'),
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.nome}
          sx={{ width: 500 }}
        />
      )
    },
    {
      accessorKey: 'dimensione',
      header: dictionary.get('dimensione'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <span>{bytesToSize(original?.dimensione)}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }: any) => (
        <TableDocumentiFascicoloButtons documento={original} disabled={disabled} />
      ),
    }
  ];

  return {
    columns,
    clearTable,
    setFilters,
    setSearch,
    setSort,
    setPage,
    tableData,
    setSelectedRows
  };
};