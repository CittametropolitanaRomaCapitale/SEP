import { GruppoBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { useOffice } from '@cmrc/auth/useOffice';
import { formatDate } from '@cmrc/ui/utils/formatters';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../../store/table/useTable';
import { dictionary } from '../../dictionary';
import TooltipEllipsisLabel from '../../../../../../components/TooltipEllipsisLabel';
import { TableGruppiButtons } from '../buttons/table_buttons/TableGruppiButtons';

export const useGruppiTable = () => {
  const { setPage, setSort, clearTable } = useTable({
    table_id: 'gruppi'
  });

  const { isUserPIAdmin, isUserArchivista } = useOffice();

  const columns: ColumnDef<GruppoBaseFragment>[] = [
    {
      id: 'nome',
      size: 350,
      header: dictionary.get('nome'),
      enableSorting: true,
      accessorKey: 'nome',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.nome}
          sx={{ width: 350 }}
        />
      )
    },
    {
      id: 'tsCreation',
      size: 200,
      header: dictionary.get('dataCreazione'),
      enableSorting: true,
      accessorKey: 'tsCreation',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={formatDate({ date: original?.tsCreation, dateOnly: true })}
          sx={{ width: 200 }}
        />
      )
    },
    {
      id: 'note',
      size: 350,
      header: dictionary.get('note'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.note}
          sx={{ width: 350 }}
        />
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        (isUserPIAdmin || isUserArchivista) ?
          <Grid justifyContent="end" display="flex" gap={1} width={1} >
            <Box onClick={(e) => e.stopPropagation()} >
              <TableGruppiButtons gruppo={original} />
            </Box>
          </Grid> : null
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
