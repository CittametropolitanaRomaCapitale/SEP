import { useEffect } from 'react';
import { useRouter } from 'next/router';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Drawer from '@cmrc/ui/components/Drawer';
import Grid from '@mui/material/Grid';
import { useDeleteApiAdminRoleByRoleIdUserAndUserIdMutation } from '@cmrc/services/sso';
import toast from '@cmrc/ui/components/Toast';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import { SortingState } from '@tanstack/react-table';
import { useDrawer } from '../../../store/drawer/useDrawer';
import { dictionary } from './dictionary';
import { useDialog } from '../../../store/dialog/useDialog';
import { DeleteDialog } from '../../../components/DeleteDialog';
import { useRuoliAmministrazioneUtenteTable } from './useRuoliAmministrazioneUtenteTable';
import AggiungiRuoloAmministrazione from './aggiungi_ruolo_amministrazione/AggiungiRuoloAmministrazione';
import FiltriRuoliAmministrazioneUtente from './FiltriRuoliAmministrazioneUtente';
import EnhancedTable from '../../../components/EnhancedTable';

export const RuoliAmministrazione = () => {
  const { query } = useRouter();
  const { tableProps, clearTable, setSort } = useRuoliAmministrazioneUtenteTable();

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
    drawer_id: 'aggiungiRuoloAmministrazioneUtente'
  });

  const { isOpen, close, content } = useDialog({
    dialog_id: 'rimuoviRuoloAmministrazione'
  });

  const [deleteAdminRoleMutation, { isLoading: isLoadingDelete }] =
    useDeleteApiAdminRoleByRoleIdUserAndUserIdMutation();

  const onDelete = () => {
    deleteAdminRoleMutation({
      userId: Number(query.id),
      roleId: content?.id
    })
      .unwrap()
      .then(() => {
        toast.success(dictionary.get('ruoloRimosso'));
      })
      .catch(() => {
        toast.error(dictionary.get('ruoloErrore'));
      });
    close();
  };

  return (
    <>
      <TableExternalHeader
        title={dictionary.get('ruoliDiAmministrazione')}
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
              aria-label="aggiungi-ruolo-amministrazione"
            >
              {dictionary.get('aggiungiRuolo')}
            </Button>
          </Grid>
        }
      />
      <Card sx={{ mb: 4, pt: 2 }}>
        <Grid sx={{ width: 1 }}>
          <TableTopBar
            leftElement={
              <FiltriRuoliAmministrazioneUtente loading={tableProps?.loading} />
            }
          />
          <EnhancedTable
            columns={tableProps?.columns}
            data={tableProps?.data}
            emptyTableText={dictionary.get('tabellaVuotaTesto')}
            loading={tableProps?.loading}
            onSort={(sort: SortingState) => {
              setSort({ table_id: 'ruoliAmministrazione', sort })
            }}
            {...tableProps}
          />
          <Drawer
            title={dictionary.get('aggiungiRuolo')}
            onClose={closeCreate}
            open={isOpenCreate}
          >
            <AggiungiRuoloAmministrazione />
          </Drawer>
          <DeleteDialog
            title={dictionary.get('rimuoviRuolo')}
            bodyText={dictionary.get('confermaRimuoviRuolo', {
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
