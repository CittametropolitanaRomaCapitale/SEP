import { ReferenteOutputDto } from '@cmrc/services/src/app/piapi/generated';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import TooltipEllipsisLabel from '../../../../../components/TooltipEllipsisLabel';

export const useAnagraficaTable = () => {
  const { setPage, setSort, clearTable, setSelectedRows } = useTable({
    table_id: 'ricercaReferenti'
  });

  const columns: ColumnDef<ReferenteOutputDto>[] = [
    {
      id: 'ragioneSociale',
      header: dictionary.get('ragioneSociale'),
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.ragioneSociale}
          sx={{ width: 200 }}
        />
      ),
      accessorKey: 'ragioneSociale'
    },
    {
      id: 'cfPiva',
      header: dictionary.get('cfPiva'),
      enableSorting: true,
      accessorKey: 'cfPiva'
    },
    {
      id: 'email',
      header: dictionary.get('email'),
      enableSorting: true,
      accessorKey: 'email',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.email}
          sx={{ width: 250 }}
        />
      )
    },
    {
      id: 'pec',
      header: dictionary.get('pec'),
      enableSorting: true,
      accessorKey: 'pec',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.pec}
          sx={{ width: 250 }}
        />
      )
    },
    {
      id: 'indirizzo',
      header: dictionary.get('indirizzo'),
      enableSorting: true,
      accessorKey: 'indirizzo'
    },
    {
      id: 'citta',
      header: dictionary.get('citta'),
      enableSorting: true,
      accessorKey: 'citta'
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