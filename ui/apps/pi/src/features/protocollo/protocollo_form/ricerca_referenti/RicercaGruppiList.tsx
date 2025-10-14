import { FCC } from '@cmrc/types/FCC';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SortingState } from '@tanstack/react-table';
import { useGruppiTable } from './hooks/useGruppiTable';
import { SelectedItem } from '../../../../components/OrganigrammaTreeView/OrganigrammaTreeView';
import { useGetReferentiList } from '../../../../hooks/useDataReferenti';
import { dictionary } from './dictionary';
import EnhancedTable from '../../../../components/NewTable';

interface RicercaGruppiListProps {
  onSelectedItemsChange: (selectedItems: SelectedItem[]) => void;
  isMultiSelect?: boolean
}

export const RicercaGruppiList: FCC<RicercaGruppiListProps> = ({ onSelectedItemsChange }) => {
  const tableRef = useRef(null);
  const { query, isReady } = useRouter();
  const { columns, setPage, setSort } = useGruppiTable();
  const { data, isLoading, isFetching } = useGetReferentiList();

  // Se lo richiede il cliente - Aggiunta del gruppo in fase di creazione protocollo
  //   const { openDrawer, closeDrawer, isOpenDrawer } = useDrawer({
  //     drawer_id: 'gruppoDrawer'
  //   });

  useEffect(() => {
    if (!isReady) return;
    const { page } = query || {}

    setPage(Number(page) || 0);
  }, [isReady]);

  return (
    <Box>
      {/* Se lo richiede il cliente - Aggiunta del gruppo in fase di creazione protocollo */}
      {/* {(!(data?.findReferenti?.referenti.length > 0) && !isLoading) &&
        <>
          <Button onClick={openDrawer} size="small" startIcon={<AddIcon />}>
            {dictionary.get('aggiungiGruppo')}
          </Button>
          <Drawer sx={{ zIndex: 1300 }}
            title={dictionary.get('aggiungiGruppo')}
            onClose={closeDrawer}
            open={isOpenDrawer}
          >
            <GruppoDrawer from='protocollo' />
          </Drawer>
        </>
      } */}
      <Grid sx={{ width: 1 }}>
        <EnhancedTable
          ref={tableRef}
          columns={columns}
          data={data?.findReferenti?.referenti}
          loading={isLoading || isFetching}
          selectable
          disabledCheckbox={data?.findReferenti?.referenti?.lenght === 0}
          onSelectRow={(row) => onSelectedItemsChange((row.map((selectedItem) => selectedItem.children))?.map(c => c).flat())}
          emptyTableText={dictionary.get('tabellaVuotaGruppi')}
          defaultSort={[{ id: 'nome', desc: false }]}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'ricercaReferenti', sort })
          }}
        />
      </Grid>
    </Box>
  );
};