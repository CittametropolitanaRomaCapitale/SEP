import { FCC } from '@cmrc/types/FCC';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, Grid } from '@mui/material';
import { SortingState } from '@tanstack/react-table';
import { useIPATableEnti } from './hooks/useRicercaIPATableEnti';
import { SelectedItem } from '../../../../components/OrganigrammaTreeView/OrganigrammaTreeView';
import { useGetReferentiList } from '../../../../hooks/useDataReferenti';
import { dictionary } from './dictionary';
import EnhancedTable from '../../../../components/NewTable';

interface RicercaIpaListEntiProps {
  onSelectedItemsChange: (selectedItems: SelectedItem[]) => void;
  onSelectedTipoRicerca: (tipo: string, codAmm: string) => void;
  isMultiSelect?: boolean;
}

export const RicercaIPAListEnti: FCC<RicercaIpaListEntiProps> = ({ onSelectedItemsChange, onSelectedTipoRicerca, isMultiSelect }) => {
  const tableRef = useRef(null);
  const { query, isReady } = useRouter();

  const { columns, setPage, setSort } = useIPATableEnti(onSelectedTipoRicerca);
  const { data, isLoading, isFetching } = useGetReferentiList();

  useEffect(() => {
    if (!isReady) return;
    const { page } = query || {};

    setPage(Number(page) || 0);
  }, [isReady]);

  return (
    <Box>
      <Grid sx={{ width: 1 }}>
        <EnhancedTable
          multiSelectable={isMultiSelect}
          ref={tableRef}
          columns={columns}
          data={data?.findReferenti?.referenti}
          loading={isLoading || isFetching}
          disabledCheckbox={data?.findReferenti?.referenti?.length === 0}
          selectable
          onSelectRow={(row) => onSelectedItemsChange(row.map((selectedItem) => selectedItem))}
          emptyTableText={dictionary.get('tabellaVuotaIPA')}
          defaultSort={[{ id: 'tsCreation', desc: true }]}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'ricercaReferenti', sort })
          }}
        />
      </Grid>
    </Box>
  );
};