import { formatDate } from '@cmrc/ui/utils/formatters';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import Box from '@mui/material/Box';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../store/table/useTable';
import TooltipEllipsisLabel from '../../../components/TooltipEllipsisLabel';
import ProtocolloActionsList from '../../protocollo/protocollo_actions/ProtocolloActionsList';
import { dictionary } from './dictionary';
import { DocumentoPrincipale } from './buttons/DocumentoPrincipale';
import { ClassificazioneTooltip } from './components/ClassificazioneTooltip';
import { VisualizzaStatoTooltip } from './components/VisualizzaStatoTooltip';
import { Tooltip, Typography } from '@mui/material';

export const useListaProtocolliTable = () => {
  const {
    tableData,
    setSort,
    clearTable,
    setPage,
    setSearch,
    setFilters,
    setSelectedRows
  } = useTable({
    table_id: 'listaProtocolli'
  });

  const columns: ColumnDef<ProtocolloBaseFragment>[] = [
    {
      id: 'nProtocollo',
      accessorKey: 'nProtocollo',
      header: dictionary.get('numero'),
      enableSorting: true,
      size: 180,
      minSize: 50,
      maxSize: 250,
      cell: ({ row: { original } }) => {
        const nProtocollo = original?.nProtocollo;
        const nProtocolloEmergenza = original?.nProtocolloEmergenza;

        const splitBySecondDash = (value?: string) => {
          if (!value) return [null, null];
          const secondDash = value.indexOf('-', value.indexOf('-') + 1);
          return [value.slice(0, secondDash + 1), value.slice(secondDash + 1)];
        };

        const [firstPart, secondPart] = splitBySecondDash(nProtocollo);

        return (
          <>
            <Tooltip title={nProtocollo} sx={{ maxWidth: 220, minWidth: 50 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: 220,
                  minWidth: 50,
                  overflow: 'hidden'
                }}
              >
                <Typography
                  variant="inherit"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {firstPart}
                </Typography>
                <Typography
                  variant="inherit"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {secondPart}
                </Typography>
              </div>
            </Tooltip>
            {nProtocolloEmergenza && (
              <Tooltip
                title={nProtocolloEmergenza}
                sx={{ maxWidth: 220, minWidth: 50 }}
              >
                <Typography variant="inherit" sx={{ color: 'red' }}>
                  {nProtocolloEmergenza}
                </Typography>
              </Tooltip>
            )}
          </>
        );
      }
    },
    {
      id: 'tipoRegistrazione',
      header: dictionary.get('tipoRegistrazione'),
      accessorFn: ({ tipoRegistrazione }) => toSentence(tipoRegistrazione),
      size: 100,
      minSize: 80,
      maxSize: 120,
      enableSorting: true
    },
    {
      id: 'metodoSpedizione',
      header: dictionary.get('metodoSpedizione'),
      accessorFn: ({ metodoSpedizione }) => toSentence(metodoSpedizione),
      size: 120,
      minSize: 100,
      maxSize: 150,
      enableSorting: true
    },
    {
      id: 'tsCreation',
      header: dictionary.get('tsCreation'),
      enableSorting: true,
      sortDescFirst: true,
      cell: ({ row: { original } }) => {
        const fullDate = formatDate({
          date: original?.tsCreation,
          dateOnly: false
        });
        const [date, time] = fullDate.split(' ');
        return (
          <Tooltip title={fullDate} sx={{ maxWidth: 220, minWidth: 50 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 220,
                minWidth: 50,
                overflow: 'hidden'
              }}
            >
              <Typography
                variant="inherit"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {date}
              </Typography>
              <Typography
                variant="inherit"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {time}
              </Typography>
            </div>
          </Tooltip>
        );
      }
    },
    {
      id: 'oggetto',
      header: dictionary.get('oggetto'),
      accessorKey: 'oggetto',
      size: 400,
      minSize: 50,
      maxSize: 400,
      enableSorting: true,
      cell: ({ row: { original } }) => {
        let oggetto = original?.oggetto ?? '';
        if (
          original?.metodoSpedizione?.toLowerCase() === 'pec' &&
          original?.tipoRegistrazione?.toLowerCase() === 'entrata'
        ) {
          oggetto = oggetto.replace(/^POSTA CERTIFICATA:\s*/i, '');
        }

        return (
          <Tooltip title={oggetto}>
            <Typography
              variant="inherit"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                maxWidth: 400,
                minWidth: 300
              }}
            >
              {oggetto}
            </Typography>
          </Tooltip>
        );
      }
    },
    {
      id: 'mittente',
      accessorKey: 'mittente',
      header: dictionary.get('mittente'),
      size: 200,
      minSize: 50,
      maxSize: 250,
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.mittente}
          sx={{ maxWidth: 220, minWidth: 50 }}
        />
      )
    },
    {
      id: 'destinatari',
      accessorKey: 'destinatari',
      header: dictionary.get('destinatari'),
      size: 250,
      minSize: 50,
      maxSize: 300,
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.destinatari}
          sx={{ maxWidth: 220, minWidth: 50 }}
        />
      )
    },
    {
      id: 'classificazione',
      header: 'classificazione',
      size: 150,
      maxSize: 150,
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <ClassificazioneTooltip
          idProtocollo={original?.id}
          label={
            original?.protocolliClassificazioneList?.length > 0 ? 'Si' : 'No'
          }
          title={dictionary.get('classificazione')}
        />
      )
    },
    {
      id: 'stato',
      accessorFn: ({ stato }) => toSentence(stato),
      header: 'stato',
      size: 180,
      maxSize: 180,
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <VisualizzaStatoTooltip
          idProtocollo={original?.id}
          title={dictionary.get('assegnatari')}
          label={toSentence(original?.stato)}
          isErrorColor={original?.stato === 'Annullato'}
        />
      )
    },
    {
      id: 'docPrincipale',
      header: dictionary.get('docPrincipale'),
      maxSize: 100,
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <DocumentoPrincipale
          allegato={original?.allegati?.find((allegato) => allegato.isMain)}
        />
      )
    },
    {
      id: 'actions',
      header: '',
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <Box onClick={(e) => e.stopPropagation()}>
          <ProtocolloActionsList protocolloData={original} from="protocolli" />
        </Box>
      )
    }
  ];

  return {
    columns,
    clearTable,
    setFilters,
    setSearch,
    setSort,
    setPage,
    tableData,
    setSelectedRows
  };
};
