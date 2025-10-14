import { formatDate } from "@cmrc/ui/utils/formatters";
import { StoricoRegistroGiornalieroBaseFragment } from "@cmrc/services/src/app/piapi/generated";
import { ColumnDef } from "@tanstack/react-table";
import TooltipEllipsisLabel from "../../../../../components/TooltipEllipsisLabel";
import { useTable } from "../../../../../store/table/useTable";
import { dictionary } from "../dictionary";

export const useRegistroGiornalieroStoricoTable = () => {
  const { tableData, setSort, clearTable, setPage } = useTable({
    table_id: 'storicoRegistroGiornaliero'
  });

  const columns: ColumnDef<StoricoRegistroGiornalieroBaseFragment>[] = [
    {
      id: 'tsCreation',
      header: dictionary.get('tsCreation'),
      enableSorting: true,
      size: 200,
      accessorFn: ({ tsCreation }) =>
        formatDate({ date: tsCreation, dateOnly: false }),
    },
    {
      id: 'operazione',
      header: dictionary.get('operazione'),
      size: 300,
      accessorKey: 'operazione',
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.operazione}
          sx={{ maxWidth: 300 }}
        />
      )
    },
    {
      id: 'note',
      header: dictionary.get('note'),
      accessorKey: 'note',
      enableSorting: false,
      size: 500,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.note}
          sx={{ maxWidth: 500 }}
        />
      )
    },
  ]

  return {
    setPage,
    setSort,
    columns,
    tableData,
    clearTable
  }
}