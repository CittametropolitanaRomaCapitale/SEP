import { PecPeo } from '@cmrc/services/src/app/piapi/generated';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../../store/table/useTable';
import { dictionary } from './dictionary';
import { TablePecPeoConfigurationButtons } from './table_buttons/TablePecPeoConfigurationButtons';
import TooltipEllipsisLabel from '../../../../../../components/TooltipEllipsisLabel';

export const usePecPeoConfigurationTable = () => {
  const { setSearch, setPage, setSort, clearTable } = useTable({ table_id: 'configurazioniPecPeo' });
  const columns: ColumnDef<PecPeo>[] = [
    {
      id: 'configurazione',
      header: dictionary.get('tipo'),
      enableSorting: true,
      accessorFn: ({ configurazione }) => configurazione?.tipologiaPosta
    },
    {
      header: dictionary.get('indirizzo'),
      enableSorting: true,
      accessorKey: 'indirizzoEmail',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.indirizzoEmail}
        />
      )
    },
    {
      header: dictionary.get('ufficio'),
      size: 400,
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.uffici?.map((ufficio) => ufficio?.cdr).join(', ')}
          sx={{ width: 400 }}
        />
      )
    },
    {
      header: dictionary.get('username'),
      enableSorting: false,
      accessorKey: "username"
    },
    {
      header: dictionary.get('utente'),
      enableSorting: false,
      accessorKey: "utente"
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <TablePecPeoConfigurationButtons configurazione={original} />
      )
    }
  ];

  return {
    columns,
    setSearch,
    setPage,
    setSort,
    clearTable,
  };
};
