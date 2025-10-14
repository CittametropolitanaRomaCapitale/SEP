import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Drawer from '@cmrc/ui/components/Drawer';
import Grid from '@mui/material/Grid';
import { useEffect } from 'react';
import { useDeleteApiPermitByIdMutation } from '@cmrc/services/sso';
import toast from '@cmrc/ui/components/Toast';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import { SortingState } from '@tanstack/react-table';
import Pagination from '../../../components/Pagination';
import { useDrawer } from '../../../store/drawer/useDrawer';
import { dictionary } from './dictionary';
import { useDialog } from '../../../store/dialog/useDialog';
import { DeleteDialog } from '../../../components/DeleteDialog';
import { usePermessiUtenteTable } from './usePermessiUtenteTable';
import AggiungiPermesso from './aggiungi_permesso/AggiungiPermesso';
import FiltriPermessiUtente from './FiltriPermessiUtente';
import EnhancedTable from '../../../components/EnhancedTable';

export const PermessiUtente = () => {
  const { data, tableProps, clearTable, setSort } = usePermessiUtenteTable();

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    },
    []
  );

  const {
    openDrawer: openCreate,
    closeDrawer: closeCreate,
    isOpenDrawer: isOpenCreate
  } = useDrawer({
    drawer_id: 'aggiungiPermessoUtente'
  });

  const { isOpen, close, content } = useDialog({
    dialog_id: 'rimuoviPermesso'
  });

  const [deletePermitMutation, { isLoading: isLoadingDelete }] =
    useDeleteApiPermitByIdMutation();

  const onDelete = () => {
    deletePermitMutation({
      id: content?.id
    })
      .unwrap()
      .then(() => {
        toast.success(dictionary.get('permessoRimosso'));
      })
      .catch(() => {
        toast.error(dictionary.get('permessoErrore'));
      });

    close();
  };

  return (
    <>
      <TableExternalHeader
        title={dictionary.get('permessi')}
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
              onClick={openCreate}
              size="small"
              sx={{ mr: 1 }}
              variant="outlined"
              aria-label="aggiungi-permesso"
            >
              {dictionary.get('aggiungiPermesso')}
            </Button>
            <Pagination table_id="permessiUtente" count={data?.pages} />
          </Grid>
        }
      />
      <Card sx={{ mb: 4, pt: 2 }}>
        <Grid sx={{ width: 1 }}>
          <TableTopBar
            leftElement={<FiltriPermessiUtente loading={tableProps?.loading} />}
          />
          <EnhancedTable
            columns={tableProps?.columns}
            data={tableProps?.data}
            emptyTableText={dictionary.get('tabellaVuotaTesto')}
            loading={tableProps?.loading}
            onSort={(sort: SortingState) => {
              setSort({ table_id: 'permessiUtente', sort })
            }}
            {...tableProps}
          />
          <Drawer
            title={dictionary.get('aggiungiPermesso')}
            onClose={closeCreate}
            open={isOpenCreate}
          >
            <AggiungiPermesso
              selectedRoles={
                tableProps?.data
                  ? tableProps?.data.map((datum) => datum.role.id)
                  : []
              }
            />
          </Drawer>
          <DeleteDialog
            title={dictionary.get('rimuoviPermesso')}
            bodyText={dictionary.get('confermaRimuoviPermesso', {
              name: content?.name || ''
            })}
            close={close}
            isOpen={isOpen}
            onDelete={onDelete}
            isLoading={isLoadingDelete}
          />
        </Grid>
      </Card>
    </>
  );
};
