import { ReferenteOutputDto } from '@cmrc/services/src/app/piapi/generated';
import { Box, Button } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import TooltipEllipsisLabel from '../../../../../components/TooltipEllipsisLabel';

export const useIPATableEnti = (onSelectedTipoRicerca: any) => {
  const { setPage, setSort, clearTable, setSelectedRows } = useTable({
    table_id: 'ricercaReferenti'
  });

  const columns: ColumnDef<ReferenteOutputDto>[] = [
    {
      id: 'label',
      header: dictionary.get('IPA_ente_label'),
      enableSorting: false,
      accessorKey: 'label',
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.label}
          sx={{ width: 400 }}
        />
      )
    },
    {
      id: 'ipaResponseDTO.acronimo',
      header: dictionary.get('IPA_ente_acronimo'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.ipaResponseDTO?.acronimo}
        />
      )
    },
    {
      id: 'ipaResponseDTO.codAmm',
      header: dictionary.get('IPA_ente_codAmm'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <TooltipEllipsisLabel
          label={original?.ipaResponseDTO?.codAmm}
        />
      )
    },
    {
      id: 'ipaResponseDTO.dettagli',
      header: dictionary.get('IPA_ente_dettagli'),
      enableSorting: false,
      cell: ({ row: { original } }) => (
        <Box>
          <Button size='small' title={dictionary.get('IPA_get_dettaglio_aoo')} onClick={() => { onSelectedTipoRicerca("aoo", original?.ipaResponseDTO?.codAmm) }}>
            AOO
          </Button>
          <Button size='small' title={dictionary.get('IPA_get_dettaglio_uo')} onClick={() => { onSelectedTipoRicerca("uo", original?.ipaResponseDTO?.codAmm) }}>
            UO
          </Button>
        </Box>
      )
    },
  ];

  return {
    columns,
    setPage,
    setSort,
    clearTable,
    setSelectedRows
  };
};
