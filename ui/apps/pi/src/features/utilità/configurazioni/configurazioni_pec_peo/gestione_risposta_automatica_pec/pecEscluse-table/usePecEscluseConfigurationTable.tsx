import { PecEscluseRispostaAutomatica } from '@cmrc/services/src/app/piapi/generated';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import { TablePecEscluseConfigurationButtons } from './table-buttons/TablePecEscluseConfigurationButtons';
import TooltipEllipsisLabel from '../../../../../../components/TooltipEllipsisLabel';
import { formatDate } from '@cmrc/ui/utils/formatters';

export const usePecEscluseConfigurationTable = () => {
  const { setSearch, setPage, setSort, clearTable } = useTable({
    table_id: 'configurazioniPecEscluseRispostaAutomatica'
  });
  const columns: ColumnDef<PecEscluseRispostaAutomatica>[] = [
    {
      header: dictionary.get('indirizzo'),
      accessorKey: 'indirizzo'
    },
    {
      id: 'tsCreation',
      size: 200,
      header: dictionary.get('dataCreazione'),
      enableSorting: true,
      accessorKey: 'tsCreation',
      cell: ({ row: { original } }) => {
        return (
          <TooltipEllipsisLabel
            label={formatDate({ date: original?.tsCreation, dateOnly: true })}
            sx={{ width: 200 }}
          />
        );
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row: { original } }) => (
        <TablePecEscluseConfigurationButtons pecEsclusaSelected={original} />
      )
    }
  ];

  return {
    columns,
    setSearch,
    setPage,
    setSort,
    clearTable
  };
};
