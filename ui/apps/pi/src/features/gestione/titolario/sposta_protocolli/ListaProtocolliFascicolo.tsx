import { FCC } from '@cmrc/types/FCC';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect } from 'react';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { SortingState } from '@tanstack/react-table';
import FiltriProtocolliFascicolo from './FiltriProtocolliFascicolo';
import { useGetProtocolliByFascicoloListQuery } from './hooks/useDataProtocolliTitolario';
import { dictionary } from '../dictionary';
import { useListaProtocolliFascicoloTable } from './hooks/useListaProtocolliTable';
import { PaginationProtocolliFascicolo } from './PaginationProtocolliFascicolo';
import { useAppSelector } from '../../../../store/hooks';
import EnhancedTable from '../../../../components/NewTable';

interface ListaProtocolliFascicoloProps {
  setSelectedProtocolli?: Dispatch<SetStateAction<ProtocolloBaseFragment[]>>;
  selectEnabled?: boolean;
}

export const ListaProtocolliFascicolo: FCC<ListaProtocolliFascicoloProps> = ({ setSelectedProtocolli, selectEnabled }) => {
  const { push, query, isReady } = useRouter();
  const { data, isLoading, isFetching } = useGetProtocolliByFascicoloListQuery();
  const { tableData, columns, clearTable, setFilters, setSearch, setPage, setSelectedRows, setSort } = useListaProtocolliFascicoloTable();

  // L'id padre viene ripreso dallo state per poterlo utilizzare nell'url
  const idPadreTitolario = useAppSelector((state) => state?.titolario?.initialData?.idPadre);

  const handleOnSelectedRow = (row) => {
    setSelectedRows(row)
    setSelectedProtocolli(row.map((selectedItem: ProtocolloBaseFragment) => selectedItem))
  }

  useEffect(() => {
    if (!isReady) return;
    const { search, page, filtro, stato, tipoRegistrazione, metodoSpedizione, ...advancedFilters } = query || {};

    setFilters({
      filtro: filtro || undefined,
      stato: stato !== undefined ? String(stato)?.split(',') : undefined,
      tipoRegistrazione: tipoRegistrazione !== undefined ? String(tipoRegistrazione)?.split(',') : undefined,
      metodoSpedizione: metodoSpedizione !== undefined ? String(metodoSpedizione)?.split(',') : undefined,
      advancedFilters: Object.keys(advancedFilters)?.length ? { ...advancedFilters } : undefined,
    });

    setSearch(String(query?.search || ''));
    setPage(Number(query?.page) || 0);
  }, [isReady]);

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    }, []
  );

  return (
    <Card sx={{ padding: 0, minHeight: '400px' }}>
      <Grid sx={{ width: '100%', height: '100%' }}>
        <TableTopBar
          leftElement={<FiltriProtocolliFascicolo loading={isLoading} />}
          rightElement={<PaginationProtocolliFascicolo pageCount={data?.getProtocolliByFascicolo?.pageCount} />}
        />
        <EnhancedTable
          columns={columns}
          data={data?.getProtocolliByFascicolo?.protocolli}
          loading={isLoading || isFetching}
          onSelectRow={(row) => handleOnSelectedRow(row)}
          emptyTableText={dictionary.get('tabellaVuotaTesto')}
          selectable={selectEnabled}
          disabledCheckbox={data?.getProtocolliByFascicolo?.protocolli?.length === 0}
          onRowClick={({ original }: { original: ProtocolloBaseFragment; }) => {
            const { advancedFilters, ...filters } = tableData?.filters || {};

            const queryParams = {
              idPadre: advancedFilters?.idPadre || idPadreTitolario,
              filtro: filters?.filtro,
              stato: filters?.stato,
              tipoRegistrazione: filters?.tipoRegistrazione,
              metodoSpedizione: filters?.metodoSpedizione,
              ...advancedFilters,
              search: tableData?.search,
              page: tableData?.page,
            };

            Object.keys(queryParams).forEach((k) => (queryParams[k] == null || queryParams[k] === '') &&
              delete queryParams[k]
            );
            push({ pathname: '/titolario', query: queryParams })
              .then(() => push(`/protocolli/${original?.nProtocollo}`));
          }}
          sx={{ height: '100%' }}
          defaultSort={[{ id: 'tsCreation', desc: true }]}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'listaProtocolliFascicolo', sort })
          }}
        />
      </Grid>
    </Card>
  );
};
