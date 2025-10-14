import { formatDate } from '@cmrc/ui/utils/formatters';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import Box from '@mui/material/Box';
import {
  EmailBaseFragment,
  EmailDirection,
  StatoProtocollo
} from '@cmrc/services/src/app/piapi/generated';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../store/table/useTable';
import TooltipEllipsisLabel from '../../../components/TooltipEllipsisLabel';
import { dictionary } from './dictionary';
import EmailActionsList from './actions/EmailActionsList';
import { ClassificazioneTooltip } from '../lista_protocolli/components/ClassificazioneTooltip';
import { Link } from '@mui/material';
import { useRouter } from 'next/router';

export const useListaEmailTable = ({ cdr, cdrCode }) => {
  const { push } = useRouter();
  const {
    tableData,
    setSort,
    clearTable,
    setPage,
    setSearch,
    setFilters,
    setSelectedRows
  } = useTable({
    table_id: 'listaEmail'
  });

  const columns: ColumnDef<EmailBaseFragment>[] = [
    {
      id: 'tipoEmail',
      accessorKey: 'tipoEmail',
      header: dictionary.get('tipoEmail'),
      enableSorting: true,
      size: 100
    },
    {
      id: 'emailDirection',
      header: dictionary.get('emailDirection'),
      enableSorting: true,
      accessorFn: ({ emailDirection }) => toSentence(emailDirection)
    },
    {
      //accessorFn: ({ protocollo }) => protocollo?.nProtocollo,
      header: dictionary.get('nProtocollo'),
      enableSorting: true,
      size: 200,
      cell: ({ row: { original } }) => {
        return (
          <Link
            href={`/protocolli/${original?.protocollo?.nProtocollo}`}
            onClick={async (e) => {
              const { advancedFilters, ...filters } = tableData?.filters || {};
              e.preventDefault();
              e.stopPropagation();
              const queryParams = {
                indirizziEmail: filters?.indirizziEmail,
                isClassificato: filters?.isClassificato,
                isAssegnato: filters?.isAssegnato,
                mostraNonLavorate: filters?.mostraNonLavorate,
                ...advancedFilters,
                page: tableData?.page
              };
              Object.keys(queryParams).forEach(
                (k) =>
                  (queryParams[k] == null || queryParams[k] === '') &&
                  delete queryParams[k]
              );
              await push({ pathname: '/pec', query: queryParams }).then(() =>
                push(`/protocolli/${original?.protocollo?.nProtocollo}`)
              );
            }}
          >
            {original?.protocollo?.nProtocollo}
          </Link>
        );
      }
    },
    {
      id: 'from',
      accessorKey: 'from',
      header: dictionary.get('from'),
      enableSorting: true,
      size: 200,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel label={original?.from} sx={{ width: 200 }} />
      )
    },
    {
      id: 'to',
      accessorKey: 'to',
      header: dictionary.get('to'),
      enableSorting: true,
      size: 200,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel label={original?.to} sx={{ width: 200 }} />
      )
    },
    {
      id: 'oggetto',
      header: dictionary.get('oggetto'),
      accessorKey: 'oggetto',
      enableSorting: true,
      size: 300,
      cell: ({ row: { original } }) => {
        const oggettoWithoutPCPrefix =
          original?.oggetto.indexOf('POSTA CERTIFICATA: ') === 0
            ? original?.oggetto.substring(19)
            : original?.oggetto;
        return (
          <TooltipEllipsisLabel
            label={oggettoWithoutPCPrefix}
            sx={{ width: 300 }}
          />
        );
      }
    },
    {
      id: 'tsInvio',
      header: dictionary.get('tsInvio'),
      enableSorting: true,
      accessorFn: ({ tsInvio }) =>
        formatDate({ date: tsInvio, dateOnly: false })
    },
    {
      id: 'tsRicezione',
      header: dictionary.get('tsRicezione'),
      enableSorting: true,
      accessorFn: ({ tsRicezione }) =>
        formatDate({ date: tsRicezione, dateOnly: false })
    },
    {
      id: 'assegnatari',
      header: dictionary.get('assegnazione'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={
            original?.protocollo?.stato !== StatoProtocollo.DaAssegnare
              ? 'Sì'
              : 'No'
          }
          // title={original?.protocollo} // TODO: mettere il tooltip
        />
      )
    },
    {
      id: 'classificazione',
      header: dictionary.get('classificazione'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        // <Box>
        //   {original?.classificazione !== null && original?.classificazione !== '' ? 'Sì' : 'No'}
        // </Box>
        <ClassificazioneTooltip
          idProtocollo={original?.protocollo?.id}
          label={
            original?.protocollo?.protocolliClassificazioneList?.length > 0
              ? 'Si'
              : 'No'
          }
          title={dictionary.get('classificazione')}
        />
      )
    },
    {
      // Stato invio è valorizzato solo in caso di email in uscita. In caso di entrata sarà visualizzato "-"
      id: 'statoInvio',
      header: dictionary.get('statoInvio'),
      enableSorting: true,
      accessorKey: 'statoInvio',
      cell: ({ row: { original } }) => (
        <Box>
          {original.emailDirection === EmailDirection.Uscita
            ? toSentence(original.statoInvio)
            : '-'}
        </Box>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({
        row: { original }
      }: {
        row: { original: EmailBaseFragment };
      }) => (
        <Box onClick={(e) => e.stopPropagation()}>
          <EmailActionsList emailData={original} cdr={cdr} cdrCode={cdrCode} />
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
