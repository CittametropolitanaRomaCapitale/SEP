import {
  ReferentiProtocolloDto,
  StatoProtocollo
} from '@cmrc/services/src/app/piapi/generated';
import Chip from '@mui/material/Chip';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import Grid from '@mui/material/Grid';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../store/table/useTable';
import { dictionary } from './dictionary';
import { AssegnatariActions } from './buttons/AssegnatariActions';

export const getColorChip = (stato) => {
  switch (stato) {
    case StatoProtocollo.DaPrendereInCarico:
      return 'primary';
    case StatoProtocollo.PresoInCarico:
      return 'success';
    case StatoProtocollo.Rifiutato:
      return 'error';
    case StatoProtocollo.Assegnato:
      return 'default';
    default:
      return 'default';
  }
};

export const useAssegnatariTable = () => {
  const { tableData, setSort, clearTable, setPage } = useTable({
    table_id: 'assegnatariList'
  });

  const columns: ColumnDef<ReferentiProtocolloDto>[] = [
    {
      id: 'nome',
      size: 600,
      header: dictionary.get('nome'),
      accessorKey: 'nomeDestinatario',
      enableSorting: true
    },
    {
      id: 'stato',
      accessorKey: 'statoProtocollo',
      header: dictionary.get('stato'),
      enableSorting: true,
      size: 400,
      cell: ({ row: { original } }) => (
        <Chip
          label={toSentence(original?.statoProtocollo)}
          color={getColorChip(original?.statoProtocollo)}
          size="small"
        />
      )
    },
    {
      id: 'note',
      size: 600,
      header: dictionary.get('note'),
      accessorKey: 'noteAssegnazione',
      enableSorting: true
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <Grid justifyContent="end" display="flex" gap={1} width={1}>
          <AssegnatariActions referente={original} />
        </Grid>
      )
    }
  ];

  return {
    setPage,
    setSort,
    columns,
    tableData,
    clearTable
  };
};
