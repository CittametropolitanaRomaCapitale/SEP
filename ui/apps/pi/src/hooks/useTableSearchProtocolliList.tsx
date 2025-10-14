import { Protocollo } from '@cmrc/services/src/app/piapi/generated';
import { formatDate } from '@cmrc/ui/utils/formatters';
import { ColumnDef } from '@tanstack/react-table';
import TooltipEllipsisLabel from '../components/TooltipEllipsisLabel';
import { dictionary } from '../dictionary';
import { TableSearchProtocolliButtons } from '../components/SearchProtocolli/TableSearchProtocolliButtons';
import { useTable } from '../store/table/useTable';

export const useTableSearchProtocolliList = (
  props: { onSelectItem?: (protocollo?: Protocollo) => void } = null
) => {
  const { setSort } = useTable({
    table_id: 'searchProtocolliList'
  });

  const columns: ColumnDef<Protocollo>[] = [
    {
      id: 'nProtocollo',
      accessorKey: 'nProtocollo',
      header: dictionary.get('numero'),
      enableSorting: true,
      size: 180,
      minSize: 50,
      maxSize: 250,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.nProtocollo}
          sx={{ maxWidth: 250 }}
        />
      )
    },
    {
      id: 'tsCreation',
      accessorKey: 'tsCreation',
      header: dictionary.get('tsCreation'),
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={formatDate({ date: original?.tsCreation, dateOnly: false })}
          sx={{ maxWidth: 220 }}
        />
      )
    },
    {
      id: 'oggetto',
      accessorKey: 'oggetto',
      header: dictionary.get('oggetto'),
      enableSorting: true,
      size: 250,
      minSize: 50,
      maxSize: 300,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.oggetto}
          sx={{ maxWidth: 300 }}
        />
      )
    },
    {
      accessorKey: 'actions',
      header: '',
      size: 80,
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TableSearchProtocolliButtons
          protocollo={original}
          onSelect={props?.onSelectItem}
        />
      )
    }
  ];

  return {
    columns,
    setSort
  };
};