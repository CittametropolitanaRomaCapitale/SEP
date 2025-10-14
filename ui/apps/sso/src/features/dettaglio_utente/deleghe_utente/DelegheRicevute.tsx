import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Drawer from '@cmrc/ui/components/Drawer';
import Grid from '@mui/material/Grid';
import { useEffect } from 'react';
import { useDeleteApiPermitDeleteDelegationByIdMutation } from '@cmrc/services/sso';
import toast from '@cmrc/ui/components/Toast';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import { SortingState } from '@tanstack/react-table';
import Pagination from '../../../components/Pagination';
import { useDrawer } from '../../../store/drawer/useDrawer';
import { dictionary } from './dictionary';
import { useDialog } from '../../../store/dialog/useDialog';
import { DeleteDialog } from '../../../components/DeleteDialog';
import { useRiceviDelegheTable } from './useRiceviDelegheTable';
import RiceviDeleghe from './aggiungi_delega/RiceviDeleghe';
import { useFormState } from '../../../store/form/useFormState';
import EnhancedTable from '../../../components/EnhancedTable';

export const DelegheRicevute = () => {
  const {
    data,
    tableProps: riceviDelegheTableProps,
    clearTable: riceviDelegheClearTable,
    setSort
  } = useRiceviDelegheTable();

  useEffect(
    () => () => {
      /** clean up */
      riceviDelegheClearTable();
    },
    []
  );

  const {
    openDrawer: openCreateRiceviDelega,
    closeDrawer: closeCreateRiceviDelega,
    isOpenDrawer: isOpenCreateRiceviDelega
  } = useDrawer({
    drawer_id: 'riceviDelega'
  });

  const { isOpen, close, content } = useDialog({
    dialog_id: 'rimuoviRiceviDelega'
  });

  const { setDefaultValues: setDefaultValuesRiceviDelega } = useFormState({
    form_id: 'formRiceviDeleghe'
  });

  const [deleteDelegationMutation, { isLoading: isLoadingDelete }] =
    useDeleteApiPermitDeleteDelegationByIdMutation();

  const onDelete = () => {
    deleteDelegationMutation({
      id: content?.id
    })
      .unwrap()
      .then(() => {
        toast.success(dictionary.get('delegaRimossa'));
      })
      .catch(() => {
        toast.error(dictionary.get('delegaErrore'));
      });

    close();
  };

  return (
    <>
      <TableExternalHeader
        title={dictionary.get('delegheRicevute')}
        rightElement={
          <Grid
            sx={{
              m: 2,
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5
            }}
          >
            <Button
              onClick={openCreateRiceviDelega}
              size="small"
              sx={{ mr: 1 }}
              variant="outlined"
              aria-label="ricevi-delega"
            >
              {dictionary.get('riceviDelega')}
            </Button>
            <Pagination table_id="riceviDeleghe" count={data?.pages} />
          </Grid>
        }
      />
      <Card sx={{ mb: 4, pt: 2 }}>
        <Grid sx={{ width: 1 }}>
          <EnhancedTable
            columns={riceviDelegheTableProps?.columns}
            data={riceviDelegheTableProps?.data}
            emptyTableText={dictionary.get('tabellaVuotaTesto')}
            loading={riceviDelegheTableProps?.loading}
            onSort={(sort: SortingState) => {
              setSort({ table_id: 'riceviDeleghe', sort })
            }}
            {...riceviDelegheTableProps}
          />
          <Drawer
            title={dictionary.get('riceviDelega')}
            onClose={() => {
              setDefaultValuesRiceviDelega({ default_values: null });
              closeCreateRiceviDelega();
            }}
            open={isOpenCreateRiceviDelega}
          >
            <RiceviDeleghe />
          </Drawer>
        </Grid>
        <DeleteDialog
          title={dictionary.get('rimuoviDelega')}
          bodyText={dictionary.get('confermaRimuoviDelega', {
            name: content?.name || ''
          })}
          close={close}
          isOpen={isOpen}
          onDelete={onDelete}
          isLoading={isLoadingDelete}
        />
      </Card>
    </>
  );
};
