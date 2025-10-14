import { FCC } from '@cmrc/types/FCC';
import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Drawer from '@cmrc/ui/components/Drawer';
import {
  ReferenteOutputDto,
  AnagraficaDto
} from '@cmrc/services/src/app/piapi/generated';
import { SortingState } from '@tanstack/react-table';
import { useAnagraficaTable } from './hooks/useRicercaAnagraficaTable';
import { SelectedItem } from '../../../../components/OrganigrammaTreeView/OrganigrammaTreeView';
import { useGetReferentiList } from '../../../../hooks/useDataReferenti';
import { dictionary } from './dictionary';
import { useDrawer } from '../../../../store/drawer/useDrawer';
import { AnagraficaDrawer } from '../../../gestione/anagrafica/gestione_anagrafica/components/AnagraficaDrawer';
import EnhancedTable from '../../../../components/NewTable';

interface RicercaAnagraficaListProps {
  onSelectedItemsChange: (selectedItems: SelectedItem[]) => void;
  isMultiSelect?: boolean;
  onContattoSaved: (contatto: ReferenteOutputDto) => void;
}

export const mapReferentiData = (data: any): any[] => {
  if (!data?.findReferenti?.referenti) {
    return [];
  }

  return data.findReferenti.referenti.map((referente: ReferenteOutputDto) => ({
    id: referente.id,
    idDestinatario: referente.idDestinatario,
    ragioneSociale: referente.ragioneSociale,
    nome: referente.nome,
    cognome: referente.cognome,
    cfPiva: referente.cfPiva,
    email: referente.email,
    pec: referente.pec,
    citta: referente.citta,
    indirizzo: referente.indirizzo,
    label: referente.label,
    tipo: referente.tipo,
    cap: referente.cap
  }));
};

export const RicercaAnagraficaList: FCC<RicercaAnagraficaListProps> = ({
  onSelectedItemsChange,
  isMultiSelect,
  onContattoSaved
}) => {
  const tableRef = useRef(null);
  const { query, isReady } = useRouter();
  const { columns, setPage, setSort } = useAnagraficaTable();
  const { data, isLoading, isFetching } = useGetReferentiList();
  const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
    drawer_id: 'anagraficaDrawer'
  });

  const mappedReferentiData = useMemo(() => mapReferentiData(data), [data]);

  useEffect(() => {
    if (!isReady) return;
    const { page } = query || {};

    setPage(Number(page) || 0);
  }, [isReady]);

  return (
    <Box>
      {!(data?.findReferenti?.referenti.length > 0) && !isLoading && (
        <>
          <Button onClick={openDrawer} size="small" startIcon={<AddIcon />}>
            {dictionary.get('aggiungiContatto')}
          </Button>
          <Drawer
            sx={{ zIndex: 1300 }}
            title={dictionary.get('aggiungiContatto')}
            onClose={closeDrawer}
            open={isOpenDrawer}
          >
            <AnagraficaDrawer
              from="protocollo"
              onContattoSaved={onContattoSaved}
            />
          </Drawer>
        </>
      )}
      <Grid sx={{ width: 1 }}>
        <EnhancedTable
          selectable
          ref={tableRef}
          columns={columns}
          data={mappedReferentiData}
          multiSelectable={isMultiSelect}
          loading={isLoading || isFetching}
          disabledCheckbox={data?.findReferenti?.referenti?.length === 0}
          onSelectRow={(row) =>
            onSelectedItemsChange(row.map((selectedItem) => selectedItem))
          }
          emptyTableText={dictionary.get('tabellaVuotaAnagrafica')}
          defaultSort={[{ id: 'ragioneSociale', desc: false }]}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'ricercaReferenti', sort });
          }}
        />
      </Grid>
    </Box>
  );
};
