import { FCC } from '@cmrc/types/FCC';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect } from 'react';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Card from '@mui/material/Card';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import Stack from '@mui/material/Stack';
import { SortingState } from '@tanstack/react-table';
import { useListaProtocolliTable } from './useListaProtocolliTable';
import { PaginationProtocolliList } from './PaginationProtocolliList';
import { useGetQueryProtocolliList } from './hooks/useDataProtocolliList';
import FiltriProtocolli from './filtri/FiltriProtocolli';
import { dictionary } from './dictionary';
import { useGetQueryDettaglioProtocollo } from '../../protocollo/useDataDettaglioProtocollo';
import EnhancedTable from '../../../components/NewTable';

interface ListaProtocolliProps {
  setSelectedProtocollo: Dispatch<SetStateAction<string>>;
  setSelectedProtocolli: Dispatch<SetStateAction<ProtocolloBaseFragment[]>>;
}

export const ListaProtocolli: FCC<ListaProtocolliProps> = ({
  setSelectedProtocollo,
  setSelectedProtocolli
}) => {
  const { push, query, isReady } = useRouter();
  const { data, isLoading, isFetching } = useGetQueryProtocolliList();
  const {
    columns,
    clearTable,
    setFilters,
    setSearch,
    tableData,
    setPage,
    setSort,
    setSelectedRows
  } = useListaProtocolliTable();
  const { refetch: dettaglioSelectedRefetch } =
    useGetQueryDettaglioProtocollo();

  const handleOnSelectedRow = (row) => {
    setSelectedRows(row);
    setSelectedProtocolli(
      row.map((selectedItem: ProtocolloBaseFragment) => selectedItem)
    );
  };

  useEffect(() => {
    if (!isReady) return;
    const {
      search,
      page,
      filtro,
      stato,
      tipoRegistrazione,
      metodoSpedizione,
      ...advancedFilters
    } = query || {};
    // utilizzo del localStorage per popolare i filtri di ricerca
    //NOTA: si potrebbe evitare l'utilizzo del localStorage facendo le chiamate del dettaglio fascicolo
    if (advancedFilters?.idTitolario) {
      advancedFilters.idTitolario = JSON.parse(
        localStorage.getItem('idTitolario')
      );
    }
    //pulisco i dati non validi
    const cleanedAdvancedFilters = Object.fromEntries(
      Object.entries(advancedFilters).filter(
        ([_, value]) =>
          value !== null &&
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );
    setFilters({
      filtro: filtro || undefined,
      stato: stato !== undefined ? String(stato)?.split(',') : undefined,
      tipoRegistrazione:
        tipoRegistrazione !== undefined
          ? String(tipoRegistrazione)?.split(',')
          : undefined,
      metodoSpedizione:
        metodoSpedizione !== undefined
          ? String(metodoSpedizione)?.split(',')
          : undefined,
      advancedFilters: Object.keys(cleanedAdvancedFilters)?.length
        ? { ...cleanedAdvancedFilters }
        : undefined
    });
    localStorage.removeItem('idTitolario');
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
    <Card sx={{ padding: 0 }}>
      <Stack sx={{ width: 1 }}>
        <TableTopBar
          leftElement={<FiltriProtocolli loading={isLoading} />}
          rightElement={<PaginationProtocolliList />}
        />
        <EnhancedTable
          columns={columns}
          data={data?.getProtocolli?.protocolli}
          loading={isLoading || isFetching}
          onSelectRow={(row) => handleOnSelectedRow(row)}
          selectable
          emptyTableText={dictionary.get('tabellaVuotaTesto')}
          onRowClick={({ original }: { original: ProtocolloBaseFragment }) => {
            const { advancedFilters, ...filters } = tableData?.filters || {};

            setSelectedProtocollo(original?.nProtocollo);
            dettaglioSelectedRefetch();
            // utilizzo del localStorage per popolare i filtri di ricerca
            localStorage.setItem(
              'idTitolario',
              JSON.stringify(advancedFilters?.idTitolario)
            );
            const queryParams = {
              filtro: filters?.filtro,
              stato: filters?.stato,
              tipoRegistrazione: filters?.tipoRegistrazione,
              metodoSpedizione: filters?.metodoSpedizione,
              ...advancedFilters,
              idTitolario: advancedFilters?.idTitolario?.map((item) => item.id),
              search: tableData?.search,
              page: tableData?.page
            };
            Object.keys(queryParams).forEach(
              (k) =>
                (queryParams[k] == null || queryParams[k] === '') &&
                delete queryParams[k]
            );
            push({ pathname: '/protocolli', query: queryParams }).then(() =>
              push(`/protocolli/${original?.nProtocollo}`)
            );
          }}
          defaultSort={[{ id: 'tsCreation', desc: true }]}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'listaProtocolli', sort });
          }}
        />
      </Stack>
    </Card>
  );
};
