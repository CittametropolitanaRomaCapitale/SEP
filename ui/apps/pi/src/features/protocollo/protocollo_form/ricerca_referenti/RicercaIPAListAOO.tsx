import { FCC } from '@cmrc/types/FCC';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, Grid, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SortingState } from '@tanstack/react-table';
import { useIPATableAOO } from './hooks/useRicercaIPATableAOO';
import { SelectedItem } from '../../../../components/OrganigrammaTreeView/OrganigrammaTreeView';
import { useGetReferentiList } from '../../../../hooks/useDataReferenti';
import { dictionary } from './dictionary';
import EnhancedTable from '../../../../components/NewTable';

interface RicercaIpaListAOOProps {
  onSelectedItemsChange: (selectedItems: SelectedItem[]) => void;
  onBack: () => void;
  isMultiSelect?: boolean;
}

export const RicercaIPAListAOO: FCC<RicercaIpaListAOOProps> = ({ onSelectedItemsChange, onBack, isMultiSelect }) => {
  const tableRef = useRef(null);
  const { query, isReady } = useRouter();

  const { columns, setPage, setSort } = useIPATableAOO();
  const { data, isLoading, isFetching } = useGetReferentiList();

  useEffect(() => {
    if (!isReady) return;
    const { page } = query || {};

    setPage(Number(page) || 0);
  }, [isReady]);

  return (
    <Box>
      <Button size='small' onClick={() => { onBack(); }} startIcon={<ArrowBackIcon />}>
        {dictionary.get('indietro')}
      </Button>
      <Grid sx={{ width: 1 }}>
        <EnhancedTable
          multiSelectable={isMultiSelect}
          ref={tableRef}
          columns={columns}
          data={data?.findReferenti?.referenti}
          loading={isLoading || isFetching}
          selectable
          disabledCheckbox={data?.findReferenti?.referenti?.length === 0}
          onSelectRow={(row) => onSelectedItemsChange(row.map((selectedItem) => selectedItem))}
          emptyTableText={dictionary.get('tabellaVuotaIPAAOO')}
          defaultSort={[{ id: 'tsCreation', desc: true }]}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'ricercaReferenti', sort })
          }}
        />
      </Grid>
    </Box>
  );
};