import { FCC } from '@cmrc/types/FCC';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Grid, Stack } from '@mui/material';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAddContactsToGroupMutation } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { SortingState } from '@tanstack/react-table';
import Pagination from '../../../../../../../components/Pagination';
import { useDialog } from '../../../../../../../store/dialog/useDialog';
import { dictionary } from './dictionary';
import { useGetQueryContattiCertificatiList } from './hooks/useDataContattiCertificatiList';
import { useGetQueryAnagraficaList } from '../../../../gestione_anagrafica/hooks/useDataAnagraficaList';
import { useGetQueryDettaglioGruppo } from '../../hooks/useDataDettaglioGruppo';
import { useContattiCertificatiTable } from './hooks/useContattiCertificatiTable';
import { SearchBarContattiCertificatiList } from './SearchBarContattiCertificatiList';
import EnhancedTable from '../../../../../../../components/NewTable';

interface RicercaContattiCertificatiListProps {
  isMultiSelect?: boolean
}

export const RicercaContattiCertificatiList: FCC<RicercaContattiCertificatiListProps> = ({ isMultiSelect }) => {
  const tableRef = useRef(null);
  const { query, isReady } = useRouter();
  const [selectedItems, setSelectedItems] = useState([]);
  const { columns, setPage, setSort } = useContattiCertificatiTable();
  const [addContattiToGruppo, { isLoading: addLoading }] = useAddContactsToGroupMutation();
  const { data, isLoading, isFetching } = useGetQueryContattiCertificatiList();
  const { data: { dettaglioGruppo } } = useGetQueryDettaglioGruppo();
  const { refetch } = useGetQueryAnagraficaList();
  const { close } = useDialog({
    dialog_id: 'ricercaContattiCertificati'
  })

  useEffect(() => {
    if (!isReady) return;
    const { page } = query || {}

    setPage(Number(page) || 0);
  }, [isReady]);

  const handleSelectedItemsChange = (items) => {
    setSelectedItems(items);
  }

  const onAddContattiToGruppo = async () => {
    const response = await addContattiToGruppo({ groupId: dettaglioGruppo?.id, contactIds: selectedItems }).unwrap();
    if (response?.addContactsToGroup) {
      toast.success(dictionary.get('addSuccess'));
      close();
      refetch();
    }
  };

  return (
    <Box>
      <Grid sx={{ width: 1 }}>
        <TableTopBar
          leftElement={<SearchBarContattiCertificatiList />}
          rightElement={<Pagination
            table_id='contattiCertificati'
            count={data?.getAllAnagrafica?.pageCount}
            size='small'
            siblingCount={0} />}
        />
        <EnhancedTable
          multiSelectable={isMultiSelect}
          ref={tableRef}
          columns={columns}
          data={data?.getAllAnagrafica?.anagraficaList}
          loading={isLoading || isFetching}
          selectable
          disabledCheckbox={data?.getAllAnagrafica?.anagraficaList?.length === 0}
          onSelectRow={(row) => handleSelectedItemsChange(row.map((selectedItem) => selectedItem?.id))}
          emptyTableText={dictionary.get('tabellaVuotaAnagrafica')}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'contattiCertificati', sort })
          }}
        />
      </Grid>
      <Grid item mt={3} justifyContent="flex-end">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
          <Button
            size="small"
            variant="outlined"
            sx={{ height: '30px' }}
            onClick={close}
          >
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            loading={addLoading}
            size="small"
            variant="contained"
            sx={{ height: '30px' }}
            onClick={onAddContattiToGruppo}
            disabled={!(selectedItems?.length > 0)}
          >
            {dictionary.get('aggiungi')}
          </LoadingButton>
        </Stack>
      </Grid>
    </Box>
  );
};