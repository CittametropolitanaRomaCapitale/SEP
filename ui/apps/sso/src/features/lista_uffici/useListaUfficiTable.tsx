import { ValueOrDefault } from '@cmrc/ui/components/ValueOrDefault';
import { Office } from '@cmrc/services/sso';
import { formatDate } from '@cmrc/ui/utils/formatters';
import { IconButton, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useRouter } from 'next/router';
import { ColumnDef } from '@tanstack/react-table';
import { dictionary } from './dictionary';
import { useTable } from '../../store/table/useTable';
import UserCell from '../../components/UserCell/UserCell';
import { useGetUffici } from './useGetUffici';

export const useListaUfficiTable = () => {
  const { setSort, clearTable } = useTable({
    table_id: 'listaUffici'
  });

  const { push } = useRouter();

  const { data, isLoading: officesLoading } = useGetUffici();

  const columns: ColumnDef<Office>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: dictionary.get('name'),
      enableSorting: true,
      cell: ({ row: { original } }) => <ValueOrDefault value={original?.name} />
    },
    {
      id: 'office_start_date',
      accessorKey: 'office_start_date',
      header: dictionary.get('office_start_date'),
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <ValueOrDefault
          value={formatDate({ date: original?.office_start_date })}
        />
      )
    },
    {
      id: 'office_end_date',
      accessorKey: 'office_end_date',
      header: dictionary.get('office_end_date'),
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <ValueOrDefault
          value={formatDate({ date: original?.office_end_date })}
        />
      )
    },
    {
      id: 'last_update',
      accessorKey: 'last_update',
      header: dictionary.get('last_update'),
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={formatDate({ date: original?.last_update })} />
      )
    },
    {
      id: 'state',
      accessorKey: 'state',
      header: dictionary.get('state'),
      cell: ({ row: { original } }) => {
        if (original?.deleted_permanent) {
          return (
            <Typography
              sx={(theme) => ({
                color: theme.palette.error.main,
                fontWeight: theme.typography.fontWeightBold
              })}
              variant="caption"
            >
              Chiuso Definitivamente
            </Typography>
          );
        }

        if (original?.deleted) {
          return (
            <Typography
              sx={(theme) => ({
                color: theme.palette.error.main,
                fontWeight: theme.typography.fontWeightBold
              })}
              variant="caption"
            >
              Chiuso
            </Typography>
          );
        }

        return (
          <Typography
            sx={(theme) => ({
              color: theme.palette.success.light,
              fontWeight: theme.typography.fontWeightBold
            })}
            variant="caption"
          >
            Attivo
          </Typography>
        );
      }
    },
    {
      id: 'dirigente_user_id',
      accessorKey: 'dirigente_user_id',
      header: dictionary.get('dirigente'),
      cell: ({ row: { original } }) => (
        <UserCell id={original?.dirigente_user_id} />
      )
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: dictionary.get('description'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.description} />
      )
    },
    {
      id: 'service',
      accessorKey: 'service',
      header: dictionary.get('service'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.service} />
      )
    },
    {
      id: 'short_description',
      accessorKey: 'short_description',
      header: dictionary.get('short_description'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.short_description} />
      )
    },
    {
      id: 'actions',
      header: '',
      size: 80,
      cell: ({ row: { original } }) => (
        <IconButton
          aria-label={`detail_${original?.deleted ? 'chiuso' : 'attivo'}`}
          onClick={() => push(`/uffici/${original?.id}`)}
        >
          <MoreHorizIcon />
        </IconButton>
      )
    }
  ];

  const tableProps: Partial<any> = {
    columns,
    data: data?.data as Office[],
    loading: officesLoading
  };

  return { data, tableProps, clearTable, setSort };
};
