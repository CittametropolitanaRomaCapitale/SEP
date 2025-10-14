import {
  RaccomandataBaseFragment,
  StatoRaccomandataProtocollo
} from '@cmrc/services/src/app/piapi/generated';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import { formatDate } from '@cmrc/ui/utils/formatters';
import Grid from '@mui/material/Grid';
import { Box, Tooltip } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import TooltipEllipsisLabel from '../../../../components/TooltipEllipsisLabel';
import { RaccomandateProtocolloTableActions } from '../table/RaccomandateProtocolloTableActions';

export const useRaccomandateProtocolloTable = () => {
  const { setPage, setSort, clearTable } = useTable({
    table_id: 'raccomandateProtocollo'
  });
  const columns: ColumnDef<RaccomandataBaseFragment>[] = [
    {
      id: 'numero',
      header: dictionary.get('numeroRaccomandata'),
      enableSorting: true,
      accessorKey: 'numero',
      cell: ({ row: { original } }) => (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            if (original?.numero && original?.idRaccomandata) {
              window.open(
                `https://www.poste.it/cerca/#/risultati-spedizioni/${original?.numero}`,
                '_blank',
                'noopener,noreferrer'
              );
            }
          }}
          sx={{
            width: 200,
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          <TooltipEllipsisLabel label={original?.numero} sx={{ width: 200 }} />
        </Box>
      )
    },
    {
      id: 'tipo',
      header: dictionary.get('tipoRaccomandata'),
      enableSorting: true,
      accessorKey: 'tipo',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel label={toSentence(original?.tipo)} />
      )
    },
    {
      id: 'tsCreation',
      header: dictionary.get('tsCreation'),
      enableSorting: true,
      accessorKey: 'tsCreation',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={formatDate({ date: original?.tsCreation, dateOnly: false })}
        />
      )
    },
    {
      id: 'tsInserimento',
      header: dictionary.get('tsInserimento'),
      enableSorting: true,
      accessorKey: 'tsInserimento',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={formatDate({ date: original?.tsInserimento, dateOnly: false })}
        />
      )
    },
    {
      id: 'tsConsegna',
      header: dictionary.get('tsConsegna'),
      enableSorting: true,
      accessorKey: 'tsConsegna',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={formatDate({ date: original?.tsConsegna, dateOnly: false })}
        />
      )
    },
    {
      id: 'stato',
      header: dictionary.get('statoRaccomandata'),
      enableSorting: true,
      accessorKey: 'stato',
      cell: ({ row: { original } }) => (
        <Tooltip
          title={
            original?.stato === StatoRaccomandataProtocollo.Normalizzazione
              ? dictionary.get('tooltipNormalizzazione')
              : toSentence(original?.stato)
          }
        >
          <Box>{toSentence(original?.stato)}</Box>
        </Tooltip>
      )
    },
    {
      id: 'statoConsegna',
      header: dictionary.get('statoConsegna'),
      enableSorting: true,
      accessorKey: 'statoConsegna',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel label={toSentence(original?.statoConsegna)} />
      )
    },
    {
      id: 'costo',
      header: dictionary.get('costoRaccomandata'),
      enableSorting: false,
      accessorKey: 'costo',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.costo ? `${original?.costo} €` : '-'}
        />
      )
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <Grid
          justifyContent="end"
          display="flex"
          gap={1}
          width={1}
          onClick={(e) => e.stopPropagation()}
        >
          <RaccomandateProtocolloTableActions raccomandata={original} />
        </Grid>
      )
    }
  ];

  return {
    columns,
    setPage,
    setSort,
    clearTable
  };
};
