import { ModelloAutomaticoDto } from '@cmrc/services/src/app/piapi/generated';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import TooltipEllipsisLabel from '../../../../components/TooltipEllipsisLabel';
import { DeleteButton } from '../buttons/DeleteButton';
import Grid from '@mui/material/Grid';
import { UpdateButton } from '../buttons/UpdateButton';

export const useModelliAutomaticiTable = () => {
  const { setSearch, setPage, setSort, clearTable } = useTable({ table_id: 'modelliAutomaticiTable' });
  const columns: ColumnDef<ModelloAutomaticoDto>[] = [
    {
        id: 'nomeModello',
        accessorKey: 'nomeModello',
        enableSorting: true,
        header: dictionary.get('nome')
    },
    {
        id: 'oggettoProtocollo',
        accessorKey: 'oggettoProtocollo',
        enableSorting: false,
        header: dictionary.get('oggetto')
    },
    {
        id: 'tipoRegistrazione',
        accessorKey: 'tipoRegistrazione',
        enableSorting: false,
        header: dictionary.get('tipoRegistrazione')
    },
    {
        id: 'metodoSpedizione',
        accessorKey: 'metodoSpedizione',
        enableSorting: false,
        header: dictionary.get('metodo')
    },
    {
        id: 'cdr',
        accessorKey: 'cdr',
        enableSorting: false,
        header: dictionary.get('cdr')
    },
    {
        id: 'hierarchyStringTitolario',
        enableSorting: false,
        header: dictionary.get('titolario'),
        cell: ({ row: { original } }) => original?.titolario !== null ? (
            <TooltipEllipsisLabel
              title={original?.hierarchyStringTitolario}
              label={original?.titolario.nome}
            />
          ) : (<>{'N.D.'}</>)
    },
    {
        id: 'id',
        header: '',
        enableSorting: false,
        cell: ({ row: { original } }) => {
            if (original?.id !== null) {
                return (
                    <Grid justifyContent="end" display="flex" gap={1} width={1}>
                        <UpdateButton modelloData={original} />
                        <DeleteButton modelloData={original} />
                    </Grid>
                );
            }
        }
    }
  ];

  return {
    columns,
    setSearch,
    setPage,
    setSort,
    clearTable,
  };
};
