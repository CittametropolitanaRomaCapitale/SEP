import { Grid, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { ValueOrDefault } from '@cmrc/ui/components/ValueOrDefault';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ColumnDef } from '@tanstack/react-table';
import { dictionary } from './dictionary';
import { useTable } from '../../../store/table/useTable';
import { useDialog } from '../../../store/dialog/useDialog';
import { useGetPermessi } from './useGetPermessi';

export const usePermessiUtenteTable = () => {
  const { setSort, clearTable } = useTable({
    table_id: 'permessiUtente'
  });
  const { openWithContent } = useDialog({
    dialog_id: 'rimuoviPermesso'
  });

  const { data, isLoading } = useGetPermessi();

  const onOpenDelete = ({ id }) => {
    openWithContent({
      content: {
        id
      }
    });
  };

  const getApplicationName = (fullName?: string) => {
    if (fullName?.toLowerCase()?.startsWith('sid')) {
      return 'SID';
    }

    if (fullName?.toLowerCase()?.startsWith('ruf')) {
      return 'RUF';
    }

    if (fullName?.toLowerCase()?.startsWith('pi')) {
      return 'PI';
    }

    return '';
  };

  const columns: ColumnDef<any>[] = [
    {
      id: 'application',
      accessorKey: 'application',
      header: dictionary.get('applicazione'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={getApplicationName(original?.role?.full_name)} />
      )
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: dictionary.get('ruolo'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.role?.name} />
      )
    },
    {
      id: 'officeName',
      accessorKey: 'officeName',
      header: dictionary.get('cdr'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.officeName} />
      )
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: dictionary.get('type'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.type} />
      )
    },
    {
      id: 'delegate_to',
      accessorKey: 'delegate_to',
      header: dictionary.get('delegatoA'),
      cell: ({ row: { original } }) =>
        original?.type === 'DELEGATION' && original?.sent ? (
          <CheckCircleIcon
            sx={(theme) => ({
              ml: 1,
              color: theme.palette.success.light,
              width: '18px',
              height: '18px'
            })}
          />
        ) : null
    },
    {
      id: 'delegate_from',
      accessorKey: 'delegate_from',
      header: dictionary.get('delegatoDa'),
      cell: ({ row: { original } }) =>
        original?.type === 'DELEGATION' && !original.sent ? (
          <CheckCircleIcon
            sx={(theme) => ({
              ml: 1,
              color: theme.palette.success.light,
              width: '18px',
              height: '18px'
            })}
          />
        ) : null
    },
    {
      id: 'actions',
      header: '',
      size: 80,
      cell: ({ row: { original } }) => (
        <Grid
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'right'
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <IconButton
            aria-label="delete"
            onClick={() => onOpenDelete({ id: original.id })}
            size="small"
            sx={{ width: '30px', height: '30px', minWidth: '30px', mr: 1 }}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Grid>
      )
    }
  ];

  const tableProps: Partial<any> = {
    columns,
    data: data?.data,
    loading: isLoading
  };

  return { data, tableProps, clearTable, setSort };
};
