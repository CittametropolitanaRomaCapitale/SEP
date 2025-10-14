import { ValueOrDefault } from '@cmrc/ui/components/ValueOrDefault';
import { UserWithAttributeDto } from '@cmrc/services/sso';
import { ColumnDef } from '@tanstack/react-table';
import { dictionary } from './dictionary';
import { useTable } from '../../store/table/useTable';
import { useGetUtenti } from './useGetUtenti';
import { Chip } from '@mui/material';

export const useListaUtentiTable = () => {
  const { clearTable, setSort } = useTable({
    table_id: 'listaUtenti'
  });

  const { data, isLoading: usersLoading, isFetching: usersFetching } = useGetUtenti();

  const columns: ColumnDef<UserWithAttributeDto>[] = [
    {
      id: 'username',
      accessorKey: 'username',
      header: dictionary.get('username'),
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.username} />
      )
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: dictionary.get('nominativo'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={(original?.lastName ?? '') + (original?.lastName && original?.firstName ? ' ' : '') + (original?.firstName ?? '')} />
      )
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: dictionary.get('email'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.email} />
      )
    },
    {
      id: 'enabled',
      accessorKey: 'enabled',
      header: dictionary.get('enabled'),
      cell: ({ row: { original } }) => (
        <Chip 
          size='small' 
          color={original?.enabled ? 'success' : 'error'}
          label={original?.enabled ? dictionary.get('userEnabled') : dictionary.get('userDisabled')} 
        />
      )
    },
    {
      id: 'department',
      accessorKey: 'department',
      enableSorting: false,
      size: 300,
      header: dictionary.get('offices'),
      cell: ({ row: { original } }) => {
        if (original?.department.length === 0) {
          return (<ValueOrDefault value={original?.department} />);
        }
        return (
          <span title={original?.department}>
            {original?.department.length > 60 ? original?.department.substring(0, 60) + '...' : original?.department}
          </span>
        );
      }
    }
  ];

  const tableProps: Partial<any> = {
    columns,
    data: data?.data,
    loading: usersLoading,
    fetching: usersFetching
  };

  return { data, tableProps, clearTable, setSort };
};
