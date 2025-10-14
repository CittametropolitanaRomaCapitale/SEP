import { AnagraficaBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import CertifiedIcon from '@mui/icons-material/GppGood';
import { Box } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../../../../store/table/useTable';
import TooltipEllipsisLabel from '../../../../../../../../components/TooltipEllipsisLabel';
import { dictionary } from '../../../../../gestione_anagrafica/dictionary';

export const useContattiCertificatiTable = () => {
  const { setPage, setSort, clearTable } = useTable({
    table_id: 'contattiCertificati'
  });

  const columns: ColumnDef<AnagraficaBaseFragment>[] = [
    {
      id: 'certificato',
      header: '',
      enableSorting: false,
      size: 1,
      accessorKey: 'certificato',
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
      // size: 100,
      accessorKey: 'nome'
    },
    {
      id: 'cognome',
      header: dictionary.get('cognome'),
      enableSorting: true,
      // size: 100,
      accessorKey: 'cognome'
    },
    {
      id: 'cfPiva',
      header: dictionary.get('cfPiva'),
      enableSorting: true,
      // size: 160,
      accessorKey: 'cfPiva'
    },
    {
      id: 'indirizzo',
      header: dictionary.get('indirizzo'),
      enableSorting: true,
      accessorKey: 'indirizzo',
      // size: 120,
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
      // size: 100,
      accessorKey: 'citta'
    },
    {
      id: 'cap',
      header: dictionary.get('cap'),
      enableSorting: true,
      // size: 70,
      accessorKey: 'cap'
    },
    {
      id: 'provincia',
      header: dictionary.get('provincia'),
      enableSorting: true,
      // size: 70,
      accessorKey: 'provincia'
    },
    {
      id: 'email',
      header: dictionary.get('email'),
      enableSorting: true,
      // size: 200,
      accessorKey: 'email',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.email}
          sx={{ width: 200 }}
        />
      )
    },
    {
      id: 'pec',
      header: dictionary.get('pec'),
      enableSorting: true,
      // size: 200,
      accessorKey: 'pec',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.pec}
          sx={{ width: 200 }}
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
          sx={{ width: 200 }}
        />
      )
    },
  ];

  return {
    columns,
    setPage,
    setSort,
    clearTable,
  };
};
