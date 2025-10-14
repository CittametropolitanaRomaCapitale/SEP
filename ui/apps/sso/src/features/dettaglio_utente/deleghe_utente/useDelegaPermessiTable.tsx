import { Grid, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { formatDate } from '@cmrc/ui/utils/formatters';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ValueOrDefault } from '@cmrc/ui/components/ValueOrDefault';
import { ColumnDef } from '@tanstack/react-table';
import { dictionary } from './dictionary';
import { useTable } from '../../../store/table/useTable';
import { useDialog } from '../../../store/dialog/useDialog';
import { useFormState } from '../../../store/form/useFormState';
import { useDrawer } from '../../../store/drawer/useDrawer';
import DelegheUserCell from './DelegheUserCell';
import { useGetDelegheInviate } from './useGetDelegheInviate';

export const useDelegaPermessiTable = () => {
  const { setSort, clearTable } = useTable({
    table_id: 'delegaPermessi'
  });
  const { openWithContent } = useDialog({
    dialog_id: 'rimuoviDelega'
  });

  const { setDefaultValues } = useFormState({
    form_id: 'formDelegaPermessi'
  });

  const { openDrawer } = useDrawer({
    drawer_id: 'delegaPermesso'
  });

  const { data, isLoading } = useGetDelegheInviate();

  const onOpenDelete = ({ id }) => {
    openWithContent({
      content: {
        id
      }
    });
  };

  const onOpenEdit = ({
    user_id,
    user_UserName,
    applicationId,
    application_Name,
    cdrCode,
    cdr_Name,
    ...values
  }) => {
    setDefaultValues({
      default_values: {
        ...values,
        user: { label: user_UserName, value: user_id },
        application: { label: application_Name, value: applicationId },
        offices: { label: cdr_Name, value: cdrCode }
      }
    });
    openDrawer();
  };

  const columns: ColumnDef<any>[] = [
    {
      id: 'application',
      accessorKey: 'application',
      header: dictionary.get('applicazione'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.application_Name} />
      )
    },
    {
      id: 'cdr',
      accessorKey: 'cdr',
      header: dictionary.get('cdr'),
      cell: ({ row: { original } }) =>
        original?.cdr_Name ? original?.cdr_Name : '-'
    },
    {
      id: 'user',
      accessorKey: 'user',
      header: dictionary.get('permessiDelegatiA'),
      cell: ({ row: { original } }) => (
        <DelegheUserCell id={original?.user_id} />
      )
    },
    {
      id: 'delegation_start',
      accessorKey: 'delegation_start',
      header: dictionary.get('dal'),
      cell: ({ row: { original } }) =>
        original?.delegation_start
          ? formatDate({ date: original?.delegation_start })
          : '-'
    },
    {
      id: 'delegation_end',
      accessorKey: 'delegation_end',
      header: dictionary.get('al'),
      cell: ({ row: { original } }) =>
        original?.delegation_end
          ? formatDate({ date: original?.delegation_end })
          : '-'
    },
    {
      id: 'attachments',
      accessorKey: 'attachments',
      header: dictionary.get('attachments'),
      cell: ({ row: { original } }) =>
        original?.attachment ? (
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
      id: 'note',
      accessorKey: 'note',
      header: dictionary.get('note'),
      cell: ({ row: { original } }) => (original?.note ? original?.note : '-')
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
            onClick={() => onOpenEdit(original)}
            size="small"
            sx={{ width: '30px', height: '30px', minWidth: '30px', mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => onOpenDelete(original)}
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
