import { formatDate } from '@cmrc/ui/utils/formatters';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import { ColumnDef } from '@tanstack/react-table';
import Chip from '@mui/material/Chip';
import { dictionary } from '../dictionary';
import TooltipEllipsisLabel from '../../../../../components/TooltipEllipsisLabel';
import { useTable } from '../../../../../store/table/useTable';
import { DocumentoPrincipale } from '../../../../scrivania/lista_protocolli/buttons/DocumentoPrincipale';

export const useListaProtocolliFascicoloTable = () => {
  const { tableData, setSort, clearTable, setPage, setSearch, setFilters, setSelectedRows } = useTable({
    table_id: 'listaProtocolliFascicolo'
  });

  const columns: ColumnDef<ProtocolloBaseFragment>[] = [
    {
      id: 'nProtocollo',
      accessorKey: 'nProtocollo',
      header: dictionary.get('numero'),
      enableSorting: true,
      size: 180,
      minSize: 100,
      maxSize: 250,
    },
    {
      id: 'tipoRegistrazione',
      header: dictionary.get('tipoRegistrazione'),
      accessorFn: ({ tipoRegistrazione }) => toSentence(tipoRegistrazione),
      size: 100,
      minSize: 80,
      maxSize: 120,
      enableSorting: true,
    },
    {
      id: 'metodoSpedizione',
      header: dictionary.get('metodoSpedizione'),
      accessorFn: ({ metodoSpedizione }) => toSentence(metodoSpedizione),
      size: 120,
      minSize: 100,
      maxSize: 150,
      enableSorting: true,
    },
    {
      id: 'tsCreation',
      header: dictionary.get('tsCreation'),
      enableSorting: true,
      sortDescFirst: true,
      accessorFn: ({ tsCreation }) =>
        formatDate({ date: tsCreation, dateOnly: false }),
    },
    {
      id: 'oggetto',
      header: dictionary.get('oggetto'),
      accessorKey: 'oggetto',
      size: 250,
      minSize: 200,
      maxSize: 300,
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.oggetto}
          sx={{ maxWidth: 250 }}
        />
      )
    },
    {
      id: 'mittente',
      accessorKey: 'mittente',
      header: dictionary.get('mittente'),
      size: 200,
      minSize: 150,
      maxSize: 250,
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.mittente}
          sx={{ maxWidth: 220 }}
        />
      )
    },
    {
      id: 'destinatari',
      accessorKey: 'destinatari',
      header: dictionary.get('destinatari'),
      size: 250,
      minSize: 200,
      maxSize: 300,
      enableSorting: true,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.destinatari}
          sx={{ maxWidth: 220 }}
        />
      )
    },
    {
      accessorFn: ({ stato }) => toSentence(stato),
      header: 'stato',
      enableSorting: true,
      size: 180,
      maxSize: 180,
      cell: ({ row: { original } }) => (
        <Chip
          label={toSentence(original?.stato)}
          size="small"
          color={original?.stato === 'Annullato' ? 'error' : 'primary'} />
      )
    },
    {
      id: 'docPrincipale',
      header: dictionary.get('docPrincipale'),
      maxSize: 100,
      enableSorting: true,
      cell: ({ row: { original } }) =>
        <DocumentoPrincipale allegato={original?.allegati?.find(allegato => allegato.isMain)} />
    },
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
