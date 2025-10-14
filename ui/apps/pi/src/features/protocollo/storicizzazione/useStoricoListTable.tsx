import { formatDate } from "@cmrc/ui/utils/formatters";
import { StoricoBaseFragment } from "@cmrc/services/src/app/piapi/generated";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "../../../store/table/useTable";
import TooltipEllipsisLabel from "../../../components/TooltipEllipsisLabel";
import { dictionary } from "./dictionary";

export const useListaStoricoTable = () => {
  const { tableData, setSort, clearTable, setPage } = useTable({
    table_id: 'storicoProtocollo'
  });

  const columns: ColumnDef<StoricoBaseFragment>[] = [
    {
      id: 'tsCreation',
      header: dictionary.get('tsCreation'),
      enableSorting: true,
      size: 150,
      accessorFn: ({ tsCreation }) =>
        formatDate({ date: tsCreation}),
    },
    {
      id: 'utente',
      accessorKey: 'utente',
      header: dictionary.get('utente'),
      enableSorting: true,
      size: 250,
    },
    {
      id: 'operazione',
      header: dictionary.get('operazione'),
      size: 550,
      accessorKey: 'operazione',
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.operazione}
        />
      )
    },
    {
      id: 'note',
      header: dictionary.get('note'),
      size: 450,
      accessorKey: 'note',
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.note}
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