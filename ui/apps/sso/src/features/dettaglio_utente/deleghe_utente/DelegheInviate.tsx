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
import { useDelegaPermessiTable } from './useDelegaPermessiTable';
import DelegaPermessi from './aggiungi_delega/DelegaPermessi';

import { useFormState } from '../../../store/form/useFormState';
import EnhancedTable from '../../../components/EnhancedTable';

export const DelegheInviate = () => {
  const {
    data,
    tableProps: delegaPermessiTableProps,
    clearTable: delegaPermessiClearTable,
    setSort
  } = useDelegaPermessiTable();

  useEffect(
    () => () => {
      /** clean up */
      delegaPermessiClearTable();
    },
    []
  );

  const {
    openDrawer: openCreateDelegaPermesso,
    closeDrawer: closeCreateDelegaPermesso,
    isOpenDrawer: isOpenCreateDelegaPermesso
  } = useDrawer({
    drawer_id: 'delegaPermesso'
  });

  const { isOpen, close, content } = useDialog({
    dialog_id: 'rimuoviDelega'
  });

  const { setDefaultValues: setDefaultValuesDelegaPermessi } = useFormState({
    form_id: 'formDelegaPermessi'
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
        title={dictionary.get('delegheInviate')}
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
              onClick={openCreateDelegaPermesso}
              size="small"
              sx={{ mr: 1 }}
              variant="outlined"
              aria-label="delega-permessi"
            >
              {dictionary.get('delegaPermessi')}
            </Button>
            <Pagination table_id="delegaPermessi" count={data?.pages} />
          </Grid>
        }
      />
      <Card sx={{ mb: 4, pt: 2 }}>
        <Grid sx={{ width: 1 }}>
          <EnhancedTable
            columns={delegaPermessiTableProps?.columns}
            data={delegaPermessiTableProps?.data}
            emptyTableText={dictionary.get('tabellaVuotaTesto')}
            loading={delegaPermessiTableProps?.loading}
            onSort={(sort: SortingState) => {
              setSort({ table_id: 'delegaPermessi', sort })
            }}
            {...delegaPermessiTableProps}
          />
          <Drawer
            title={dictionary.get('delegaPermessi')}
            onClose={() => {
              setDefaultValuesDelegaPermessi({ default_values: null });
              closeCreateDelegaPermesso();
            }}
            open={isOpenCreateDelegaPermesso}
          >
            <DelegaPermessi />
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
