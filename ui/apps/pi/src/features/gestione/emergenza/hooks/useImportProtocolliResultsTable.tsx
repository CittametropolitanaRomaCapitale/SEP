import { Box, Typography } from '@mui/material';
import CanRole from '@cmrc/ui/components/CanRole';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../store/table/useTable';
import { dictionary } from '../dictionary';

export const useProtocolliResultsTable = () => {
  const { clearTable } = useTable({
    table_id: 'protocolli_emergenza'
  });

  const columns: ColumnDef<any>[] = [
    {
      id: 'nProtocollo',
      header: dictionary.get('nProtocollo'),
      enableSorting: false,
      //size: 200,
      accessorKey: 'nProtocollo'
    },
    {
      id: 'nProtocolloEmergenza',
      header: dictionary.get('nProtocolloEmergenza'),
      enableSorting: false,
      // size: 150,
      accessorKey: 'nProtocolloEmergenza'
    },
    {
      id: 'imported',
      header: dictionary.get('isProtocolloImported'),
      enableSorting: false,
      // size: 150,
      //accessorKey: 'nProtocolloEmergenza'
      cell: ({ row: { original } }) => (
        <Typography>{original.imported ? dictionary.get('protocolloImported') : dictionary.get('protocolloNotImported')}</Typography>
      )
    }
  ];

  return {
    columns,
    clearTable
  };
};
