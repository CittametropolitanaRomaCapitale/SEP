import { ReferenteOutputDto } from '@cmrc/services/src/app/piapi/generated';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import TooltipEllipsisLabel from '../../../../../components/TooltipEllipsisLabel';

export const useIPATableAOO = () => {
  const { setPage, setSort, clearTable, setSelectedRows } = useTable({
    table_id: 'ricercaReferenti'
  });

  const columns: ColumnDef<ReferenteOutputDto>[] = [
    {
      id: 'label',
      header: dictionary.get('IPA_aoo_label'),
      enableSorting: false,
      accessorKey: 'label',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.label}
        />
      )
    },
    {
      id: 'cfPiva',
      header: dictionary.get('IPA_cfPiva'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.ipaResponseDTO?.cfPiva}
        />
      )
    },
    {
      id: 'indirizzo',
      header: dictionary.get('IPA_aoo_indirizzo'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.ipaResponseDTO?.indirizzo}
        />
      )
    },
    {
      id: 'citta',
      header: dictionary.get('IPA_aoo_citta'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.ipaResponseDTO?.citta}
        />
      )
    },
    {
      id: 'pec',
      header: dictionary.get('IPA_aoo_pec'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.ipaResponseDTO?.pec}
        />
      )
    }

  ];

  return {
    columns,
    setPage,
    setSort,
    clearTable,
    setSelectedRows
  };
};
