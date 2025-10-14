import { ReferenteOutputDto } from '@cmrc/services/src/app/piapi/generated';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import TooltipEllipsisLabel from '../../../../../components/TooltipEllipsisLabel';

export const useGruppiTable = () => {
  const { setPage, setSort, clearTable, setSelectedRows } = useTable({
    table_id: 'ricercaReferenti'
  });

  const columns: ColumnDef<ReferenteOutputDto>[] = [
    {
      id: 'nome',
      header: dictionary.get('nome'),
      enableSorting: true,
      size: 500,
      accessorKey: 'nome',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.nome}
          sx={{ width: 500 }}
        />
      )
    },
    {
      id: 'descrizione',
      header: dictionary.get('note'),
      enableSorting: false,
      size: 500,
      accessorKey: 'descrizione',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.descrizione}
          sx={{ width: 500 }}
        />
      )
    }
  ];

  return {
    columns,
    setPage,
    setSort,
    clearTable,
    setSelectedRows
  };
};
