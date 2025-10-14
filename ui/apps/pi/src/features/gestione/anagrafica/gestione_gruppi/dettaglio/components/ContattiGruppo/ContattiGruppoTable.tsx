import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { SortingState } from '@tanstack/react-table';
import { useGetQueryAnagraficaList } from '../../../../gestione_anagrafica/hooks/useDataAnagraficaList';
import { PaginationAnagraficaList } from '../../../../gestione_anagrafica/components/PaginationAnagraficaList';
import { SearchBarAnagraficaList } from '../../../../gestione_anagrafica/components/SearchBarAnagraficaList';
import { dictionary } from './dictionary';
import { useContattiGruppoTable } from './hooks/useContattiGruppoTable';
import EnhancedTable from '../../../../../../../components/NewTable';

export const ContattiGruppoTable = () => {
    const { columns, setSort } = useContattiGruppoTable();
    const { data, isLoading, isFetching } = useGetQueryAnagraficaList();

    return (
        <Card sx={{ padding: 0, minHeight: '400px' }}>
            <Grid sx={{ width: '100%', height: '100%' }}>
                <TableTopBar
                    leftElement={<SearchBarAnagraficaList />}
                    rightElement={<PaginationAnagraficaList />}
                />
                <EnhancedTable
                    columns={columns}
                    data={data?.getAllAnagrafica?.anagraficaList}
                    loading={isLoading || isFetching}
                    emptyTableText={dictionary.get('tabellaVuotaContattiGruppo')}
                    onSort={(sort: SortingState) => {
                        setSort({ table_id: 'anagrafica', sort })
                    }}
                />
            </Grid>
        </Card>
    );
};