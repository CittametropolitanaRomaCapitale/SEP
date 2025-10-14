import { VisibilitaTitolario } from "@cmrc/services/src/app/piapi/generated";
import { ColumnDef } from "@tanstack/react-table";
import { dictionary } from "./dictionary";
import { useTable } from "../../../../../../store/table/useTable";
import TooltipEllipsisLabel from "../../../../../../components/TooltipEllipsisLabel";
import { PermessiFascicoloButtons } from "./buttons/PermessiFascicoloButtons";

export const usePermessiFascicoloTable = () => {
  const { tableData, setSort, clearTable, setPage, setSearch, setFilters } = useTable({
    table_id: 'permessiFascicolo'
  });

  const columns: ColumnDef<VisibilitaTitolario>[] = [
    {
      id: 'write',
      header: dictionary.get('permesso'),
      enableSorting: true,
      accessorFn: ({ write }) => write ? dictionary.get('scrittura') : dictionary.get('lettura'),
    },
    {
      id: 'cdr',
      size: 300,
      header: dictionary.get('cdr'),
      enableSorting: true,
      accessorKey: 'cdr',
    },
    {
      id: 'usernameUtente',
      size: 200,
      accessorKey: 'usernameUtente',
      header: dictionary.get('username'),
      enableSorting: true,
    },
    {
      id: 'nomeUtente',
      size: 200,
      accessorKey: 'nomeUtente',
      header: dictionary.get('utente'),
      enableSorting: true,
    },
    {
      id: 'note',
      header: dictionary.get('note'),
      accessorKey: 'note',
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.note}
          sx={{ width: 300 }}
        />
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }: any) => (
        <PermessiFascicoloButtons permesso={original} />
      )
    }
  ]

  return {
    setPage,
    setSearch,
    setFilters,
    setSort,
    columns,
    tableData,
    clearTable
  }
}