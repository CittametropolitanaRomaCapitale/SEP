import { ValueOrDefault } from '@cmrc/ui/components/ValueOrDefault';
import { useGetApiOfficeByIdQuery, User } from '@cmrc/services/sso';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../store/table/useTable';
import { dictionary } from '../dictionary';
import { useGetUtentiUfficio } from '../useGetUtentiUfficio';
import { useDialog } from '../../../store/dialog/useDialog';

export const useUtentiUfficioTable = () => {
  const { query } = useRouter();
  const { setSort, clearTable } = useTable({
    table_id: 'utentiUfficio'
  });

  const { openWithContent } = useDialog({
    dialog_id: 'eliminaUtente'
  });

  const { data, isLoading: usersLoading } = useGetUtentiUfficio();

  const { data: officeData } = useGetApiOfficeByIdQuery({
    id: Number(query?.id)
  });

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    },
    []
  );
  const onOpenDelete = ({ id, username }) => {
    openWithContent({
      content: {
        name: username,
        id
      }
    });
  };

  const columns: ColumnDef<User>[] = [
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
      id: 'firstName',
      accessorKey: 'firstName',
      header: dictionary.get('nome'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.firstName} />
      )
    },
    {
      id: 'lastName',
      accessorKey: 'lastName',
      header: dictionary.get('cognome'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.lastName} />
      )
    },
    {
      id: 'actions',
      header: '',
      size: 80,
      cell: ({ row: { original } }) =>
        !officeData?.deleted ? (
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
              onClick={() => onOpenDelete({id: original?.id, username: original?.username})}
              size="small"
              sx={{ width: '30px', height: '30px', minWidth: '30px', mr: 1 }}
            >
              <DeleteForeverIcon />
            </IconButton>
          </Grid>
        ) : null
    }
  ];

  const tableProps: Partial<any> = {
    columns,
    data: data?.data,
    loading: usersLoading
  };

  return { data, tableProps, clearTable, setSort };
};
