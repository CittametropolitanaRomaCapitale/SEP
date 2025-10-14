import { Grid, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { AdminApplicationRole } from '@cmrc/services/sso';
import { ValueOrDefault } from '@cmrc/ui/components/ValueOrDefault';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../store/table/useTable';
import { useDialog } from '../../../store/dialog/useDialog';
import { useGetRuoliAmministrazione } from './useGetRuoliAmministrazione';
import { dictionary } from './dictionary';

export const useRuoliAmministrazioneUtenteTable = () => {
  const { setSort, clearTable } = useTable({
    table_id: 'ruoliAmministrazione'
  });
  const { openWithContent } = useDialog({
    dialog_id: 'rimuoviRuoloAmministrazione'
  });

  const { data, isLoading } = useGetRuoliAmministrazione();

  const getApplicationName = (complete_role?: string) => {
    if (complete_role?.toLowerCase()?.startsWith('sid')) {
      return 'SID';
    }

    if (complete_role?.toLowerCase()?.startsWith('ruf')) {
      return 'RUF';
    }

    if (complete_role?.toLowerCase()?.startsWith('pi')) {
      return 'PI';
    }

    return '';
  };

  const onOpenDelete = ({ id, role }) => {
    openWithContent({
      content: {
        id,
        name: role
      }
    });
  };

  const columns: ColumnDef<AdminApplicationRole>[] = [
    {
      id: 'application',
      accessorKey: 'application',
      header: dictionary.get('applicazione'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={getApplicationName(original?.complete_role)} />
      )
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: dictionary.get('ruolo'),
      cell: ({ row: { original } }) => <ValueOrDefault value={original?.role} />
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
            onClick={() => onOpenDelete({ id: original.id, role: original.role })}
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
    data,
    loading: isLoading
  };

  return { data, tableProps, clearTable, setSort };
};
