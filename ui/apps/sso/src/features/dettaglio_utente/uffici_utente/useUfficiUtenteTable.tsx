import { Grid, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { UserOffice } from '@cmrc/services/sso';
import { ValueOrDefault } from '@cmrc/ui/components/ValueOrDefault';
import { ColumnDef } from '@tanstack/react-table';
import { dictionary } from './dictionary';
import { useTable } from '../../../store/table/useTable';
import { useGetUfficiUtente } from '../useGetUfficiUtente';
import { useDialog } from '../../../store/dialog/useDialog';

export const useUfficiUtenteTable = () => {
  const { setSort, clearTable } = useTable({
    table_id: 'ufficiUtente'
  });
  const { openWithContent } = useDialog({
    dialog_id: 'rimuoviUfficio'
  });

  const { data, isLoading: officesLoading } = useGetUfficiUtente();

  const onOpenDelete = ({ office }) => {
    openWithContent({
      content: {
        name: office.name || '-',
        id: office.id || null
      }
    });
  };

  const columns: ColumnDef<UserOffice>[] = [
    {
      id: 'office',
      accessorKey: 'office',
      header: dictionary.get('cdr'),
      cell: ({ row: { original } }) => (
        <ValueOrDefault value={original?.office?.name} />
      ),

      enableSorting: true
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
            onClick={() => onOpenDelete({office: original?.office})}
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
    loading: officesLoading
  };

  return { data, tableProps, clearTable, setSort };
};
