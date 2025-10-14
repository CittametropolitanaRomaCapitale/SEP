import { useEffect } from 'react';
import { useRouter } from 'next/router';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import { SortingState } from '@tanstack/react-table';
import Pagination from '../../../../../../components/Pagination';
import { usePecEscluseConfigurationTable } from './usePecEscluseConfigurationTable';
import { AddPecEsclusa } from './table-buttons/AddPecEsclusa';
import { FiltriListaPecEscluseRispostaAutomatica } from './filtri/FiltriListaPecEscluseRispostaAutomatica';
import { useGetQueryPecEscluseList } from '../hooks/useDataPecEscluseRispostaAutomatica';
import { dictionary } from '../dictionary';
import EnhancedTable from '../../../../../../components/NewTable';
import { Box, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export const PecEscluseRispostaAutomaticaConfiguration = () => {
  const { query, isReady } = useRouter();
  const { columns, clearTable, setPage, setSearch, setSort } =
    usePecEscluseConfigurationTable();
  const { data, isLoading, isFetching } = useGetQueryPecEscluseList();
  useEffect(() => {
    if (!isReady) return;
    setSearch(String(query?.search || ''));
    setPage(Number(query?.page) || 0);
  }, [isReady]);

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    },
    []
  );

  return (
    <>
      <TableExternalHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {dictionary.get('configurazioniPecEscluseRispostaAutomatica')}
            <Tooltip title={dictionary.get('infoTooltip')} placement="top">
              <InfoIcon
                sx={{
                  fontSize: 'small',
                  color: 'action.active',
                  cursor: 'pointer'
                }}
              />
            </Tooltip>
          </Box>
        }
        rightElement={<AddPecEsclusa />}
      />
      <TableTopBar
        leftElement={<FiltriListaPecEscluseRispostaAutomatica />}
        rightElement={
          <Pagination
            table_id="configurazioniPecEscluseRispostaAutomatica"
            count={data?.getPecEscluseList?.pageCount}
          />
        }
      />
      <EnhancedTable
        columns={columns}
        data={data?.getPecEscluseList?.pecEscluseRispostaAutomaticaList}
        loading={isLoading || isFetching}
        emptyTableText={dictionary.get('tabellaVuotaPecEscluse')}
        onSort={(sort: SortingState) => {
          setSort({
            table_id: 'configurazioniPecEscluseRispostaAutomatica',
            sort
          });
        }}
      />
    </>
  );
};
