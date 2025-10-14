import { RegistroGiornaliero } from '@cmrc/services/src/app/piapi/generated';
import { formatDate } from '@cmrc/ui/utils/formatters';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import TooltipEllipsisLabel from '../../../../components/TooltipEllipsisLabel';
import { RegistroGiornalieroActions } from '../RegistroGiornalieroActions';

export const useRegistroGiornalieroTable = () => {
  const { setPage, setSort, clearTable, setFilters } = useTable({
    table_id: 'registroGiornaliero'
  });

  const columns: ColumnDef<RegistroGiornaliero>[] = [
    {
      id: 'file',
      header: dictionary.get('nome'),
      enableSorting: true,
      accessorKey: 'file',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.file}
          sx={{ maxWidth: 300 }}
        />
      )
    },
    {
      id: 'dataRegistro',
      header: dictionary.get('data'),
      enableSorting: true,
      accessorKey: 'dataRegistro',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={formatDate({ date: original?.dataRegistro, dateOnly: true })}
          sx={{ maxWidth: 170 }}
        />
      )
    },
    {
      id: 'note',
      header: dictionary.get('note'),
      enableSorting: false,
      accessorKey: 'note',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.note}
          sx={{ maxWidth: 300 }}
        />
      )
    },
    {
      id: 'esitoVersamento',
      header: dictionary.get('esitoVersamento'),
      enableSorting: true,
      accessorKey: 'esitoVersamento',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.esitoVersamento}
          sx={{ maxWidth: 200 }}
        />
      )
    },
    {
      id: 'urn',
      header: dictionary.get('urn'),
      enableSorting: true,
      accessorKey: 'urn',
      // cell: ({ row: { original } }) => (
      //   <TooltipEllipsisLabel
      //     label={original?.urn}
      //     sx={{ maxWidth: 400 }}
      //   />
      // )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <div style={{ textAlign: 'right', width: '100%' }}>
          <RegistroGiornalieroActions registroGiornaliero={original} />
        </div>
      )
    }
  ];

  return {
    columns,
    setPage,
    setSort,
    clearTable,
    setFilters
  };
};
