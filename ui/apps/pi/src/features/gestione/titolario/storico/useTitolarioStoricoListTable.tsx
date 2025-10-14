import { formatDate } from "@cmrc/ui/utils/formatters";
import { StoricoBaseFragment } from "@cmrc/services/src/app/piapi/generated";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "../../../../store/table/useTable";
import TooltipEllipsisLabel from "../../../../components/TooltipEllipsisLabel";
import { dictionary } from "./dictionary";

export const useTitolarioStoricoListTable = () => {
  const { tableData, setSort, clearTable, setPage } = useTable({
    table_id: 'storicoTitolario'
  });

  const columns: ColumnDef<StoricoBaseFragment>[] = [
    {
      id: 'tsCreation',
      header: dictionary.get('tsCreation'),
      enableSorting: true,
      size: 200,
      accessorFn: ({ tsCreation }) =>
        formatDate({ date: tsCreation, dateOnly: false }),
    },
    {
      id: 'utente',
      accessorKey: 'utente',
      header: dictionary.get('utente'),
      enableSorting: true,
      size: 200,
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
          sx={{ width: 300 }}
        />
      )
    },
    {
      id: 'note',
      header: dictionary.get('note'),
      size: 400,
      accessorKey: 'note',
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.note}
          sx={{ width: 400 }}
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