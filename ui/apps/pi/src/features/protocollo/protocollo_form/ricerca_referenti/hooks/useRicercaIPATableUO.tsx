import { ReferenteOutputDto } from '@cmrc/services/src/app/piapi/generated';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import TooltipEllipsisLabel from '../../../../../components/TooltipEllipsisLabel';

export const useIPATableUO = () => {
  const { setPage, setSort, clearTable, setSelectedRows } = useTable({
    table_id: 'ricercaReferenti'
  });

  const columns: ColumnDef<ReferenteOutputDto>[] = [
    {
      id: 'label',
      header: dictionary.get('IPA_uo_label'),
      enableSorting: false,
      accessorKey: 'label',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.label}
        />
      ),
    },
    {
      id: 'ipaResponseDTO.codUniOU',
      header: dictionary.get('IPA_codUniOU'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.ipaResponseDTO?.codUniOU}
        />
      ),
    },
    {
      id: 'ipaResponseDTO.cfPiva',
      header: dictionary.get('IPA_cfPiva'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.ipaResponseDTO?.cfPiva}
        />
      ),
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
