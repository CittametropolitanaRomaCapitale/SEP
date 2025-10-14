import { AnagraficaDto } from '@cmrc/services/src/app/piapi/generated';
import CertifiedIcon from '@mui/icons-material/GppGood';
import { Box } from '@mui/material';
import CanRole from '@cmrc/ui/components/CanRole';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import { TableAnagraficaButtons } from '../buttons/table_buttons/TableAnagraficaButtons';
import TooltipEllipsisLabel from '../../../../../components/TooltipEllipsisLabel';

export const useAnagraficaTable = () => {
  const { setPage, setSort, clearTable } = useTable({
    table_id: 'anagrafica'
  });

  const columns: ColumnDef<AnagraficaDto>[] = [
    {
      id: 'certificato',
      header: '',
      enableSorting: false,
      accessorKey: 'certificato',
      size: 1,
      cell: ({ row: { original } }) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {original?.certificato && (
            <CertifiedIcon color="primary" fontSize='small' titleAccess={dictionary.get('certificato')} />
          )}
        </Box>
      )
    },
    {
      id: 'ragioneSociale',
      header: dictionary.get('ragioneSociale'),
      enableSorting: true,
      size: 200,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.ragioneSociale}
          sx={{ width: 200 }}
        />
      ),
      accessorKey: 'ragioneSociale'
    },
    {
      id: 'nome',
      header: dictionary.get('nome'),
      enableSorting: true,
      // size: 150,
      accessorKey: 'nome'
    },
    {
      id: 'cognome',
      header: dictionary.get('cognome'),
      enableSorting: true,
      // size: 150,
      accessorKey: 'cognome'
    },
    {
      id: 'cfPiva',
      header: dictionary.get('cfPiva'),
      enableSorting: true,
      size: 200,
      accessorKey: 'cfPiva'
    },
    {
      id: 'indirizzo',
      header: dictionary.get('indirizzo'),
      enableSorting: true,
      size: 200,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.indirizzo}
          sx={{ width: 200 }}
        />
      )
    },
    {
      id: 'citta',
      header: dictionary.get('citta'),
      enableSorting: true,
      size: 100,
      accessorKey: 'citta'
    },
    {
      id: 'cap',
      header: dictionary.get('cap'),
      enableSorting: true,
      size: 100,
      accessorKey: 'cap'
    },
    {
      id: 'provincia',
      header: dictionary.get('provincia'),
      enableSorting: true,
      size: 80,
      accessorKey: 'provincia'
    },
    {
      id: 'email',
      header: dictionary.get('email'),
      enableSorting: true,
      size: 250,
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
      size: 250,
      accessorKey: 'pec',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.pec}
          sx={{ width: 250 }}
        />
      )
    },
    {
      id: 'telefono',
      header: dictionary.get('telefono'),
      enableSorting: false,
      // size: 130,
      accessorKey: 'telefono'
    },
    {
      id: 'fax',
      header: dictionary.get('fax'),
      enableSorting: false,
      // size: 130,
      accessorKey: 'fax'
    },
    {
      id: 'note',
      header: dictionary.get('note'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.note}
          sx={{ width: 250 }}
        />
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <CanRole roleIds={['PI_admin']} resourceIds={['pi_admin_resource']}>
          {/* Le actions di gestione dei contatti sono visibili solo per gli utenti admin */}
          <TableAnagraficaButtons contatto={original} />
        </CanRole>
      )
    }
  ];

  return {
    columns,
    setPage,
    setSort,
    clearTable,
  };
};
