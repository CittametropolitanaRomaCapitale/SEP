import { useEffect, useState } from 'react';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import {
  useDeleteApiOfficeByOfficeIdAndUserIdMutation,
  useDeleteApiOfficeByOfficeIdUsersMutation,
  useGetApiOfficeByIdQuery,
  usePutApiOfficeByOfficeIdSplitMutation
} from '@cmrc/services/sso';
import toast from '@cmrc/ui/components/Toast';
import Drawer from '@cmrc/ui/components/Drawer';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import { SortingState } from '@tanstack/react-table';
import FiltriUtenti from './FiltriUtenti';
import { useUtentiUfficioTable } from './useUtentiUfficioTable';
import Pagination from '../../../components/Pagination';
import { dictionary } from '../dictionary';
import { useDrawer } from '../../../store/drawer/useDrawer';
import { DeleteDialog } from '../../../components/DeleteDialog';
import { useDialog } from '../../../store/dialog/useDialog';
import Utente from './utente_ufficio/Utente';
import { SpostaUtenti } from './sposta_utenti/SpostaUtenti';
import { useFormState } from '../../../store/form/useForm';
import { ConfermaEliminaUtente } from './ConfermaEliminaUtente';
import EnhancedTable from '../../../components/EnhancedTable';
import { SIZE_UTENTI_UFFICIO } from '../../../const';

export const UtentiUfficio = () => {
  const { query, push } = useRouter();
  const { data, tableProps, clearTable, setSort } = useUtentiUfficioTable();

  const [selectedUtenti, setSelectedUtenti] = useState([]);

  const [moveUsers, { isLoading: moveUsersLoading }] =
    usePutApiOfficeByOfficeIdSplitMutation();

  const [deleteUserMutation, { isLoading: isLoadingDeleteUtente }] =
    useDeleteApiOfficeByOfficeIdAndUserIdMutation();

  const [
    deleteUserPermissionsMutation,
    { isLoading: isLoadingDeleteUtentePermissions }
  ] = useDeleteApiOfficeByOfficeIdAndUserIdMutation();

  const [deleteUsersMutation, { isLoading: isLoadingDeleteUtenti }] =
    useDeleteApiOfficeByOfficeIdUsersMutation();

  const { data: officeData } = useGetApiOfficeByIdQuery({
    id: Number(query?.id)
  });

  const {
    openDrawer: openAggiungiUtenti,
    closeDrawer: closeAggiungiUtenti,
    isOpenDrawer: isOpenAggiungiUtenti
  } = useDrawer({
    drawer_id: 'aggiungiUtenti'
  });

  const { setDefaultValues } = useFormState({
    form_id: 'formSostaUtenti'
  });

  const {
    openDrawer: openMoveUsers,
    closeDrawer: closeMoveUsers,
    isOpenDrawer: isOpenMoveUsers
  } = useDrawer({
    drawer_id: 'spostaUtenti'
  });

  const {
    isOpen: isOpenUtente,
    close: closeUtente,
    content
  } = useDialog({
    dialog_id: 'eliminaUtente'
  });

  const {
    open: openUtenti,
    isOpen: isOpenUtenti,
    close: closeUtenti
  } = useDialog({
    dialog_id: 'eliminaUtenti'
  });

  const onMoveUsers = ({ mantieni, offices, filteredUtenti }) => {
    const userUpdates = filteredUtenti.map((user) => ({
      userId: user.id,
      offices: offices.map((office) => office.value)
    }));

    moveUsers({
      officeId: Number(query?.id),
      moveUsersToOfficeInput: {
        userUpdates,
        deleteOffice: !mantieni
      }
    })
      .unwrap()
      .then(() => {
        toast.success(dictionary.get('utentiSpostati'));
      })
      .catch(() => {
        toast.error(dictionary.get('errore'));
      });

    closeMoveUsers();
  };

  const onDeleteUtenti = () => {
    deleteUsersMutation({
      officeId: Number(query?.id),
      userIdListBean: {
        user_ids: selectedUtenti.map((utente) => utente.id)
      }
    })
      .then(() => toast.success(dictionary.get('utentiEliminati')))
      .catch(() => toast.error(dictionary.get('errore')))
      .finally(closeUtenti);
  };

  const onDeleteUtente = ({ deletePermits }: { deletePermits: boolean }) => {
    if (deletePermits) {
      deleteUserPermissionsMutation({
        userId: content?.id,
        officeId: Number(query?.id),
        removeUserFromOfficeInput: {
          deletePermits
        }
      })
        .unwrap()
        .then(() => {
          toast.success(dictionary.get('utentePermessiEliminati'));
        })
        .catch(() => {
          toast.error(dictionary.get('errore'));
        })
        .finally(() => {
          closeUtente();
        });
    } else {
      deleteUserMutation({
        userId: content?.id,
        officeId: Number(query?.id),
        removeUserFromOfficeInput: {
          deletePermits
        }
      })
        .unwrap()
        .then(() => {
          toast.success(dictionary.get('utenteEliminato'));
        })
        .catch(() => {
          toast.error(dictionary.get('errore'));
        })
        .finally(() => {
          closeUtente();
        });
    }
  };

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    },
    []
  );

  return (
    <>
      <TableExternalHeader
        title={dictionary.get('utenti')}
        rightElement={
          <Grid
            sx={{
              m: 2,
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5
            }}
          >
            <Grid xs={2}>
              {!officeData?.deleted ? (
                <Button
                  onClick={openAggiungiUtenti}
                  size="small"
                  sx={{ mr: 1 }}
                  variant="outlined"
                  aria-label="aggiungi"
                >
                  {dictionary.get('aggiungiUtenti')}
                </Button>
              ) : null}
              <Button
                onClick={openMoveUsers}
                size="small"
                sx={{ mr: 1 }}
                variant="contained"
                disabled={!selectedUtenti.length}
                aria-label="sposta"
              >
                {dictionary.get('spostaUtenti')}
              </Button>
              {!officeData?.deleted ? (
                <Button
                  onClick={openUtenti}
                  size="small"
                  sx={{ mr: 1 }}
                  variant="text"
                  disabled={!selectedUtenti.length}
                  aria-label="elimina"
                >
                  {dictionary.get('eliminaSelezionati')}
                </Button>
              ) : null}
            </Grid>
            <Pagination table_id="utentiUfficio" count={data?.pages} />
          </Grid>
        }
      />
      <Card sx={{ padding: 0 }}>
        <Grid sx={{ width: 1 }}>
          <TableTopBar
            leftElement={
              <Stack direction="row" spacing={2} alignItems="baseline">
                <FiltriUtenti loading={tableProps?.loading} />
              </Stack>
            }
          />
          <EnhancedTable
            onRowClick={({ original }) => push(`/utenti/${original.id}`)}
            emptyTableText={dictionary.get('tabellaVuotaTesto')}
            selectable
            defaultPageSize={SIZE_UTENTI_UFFICIO}
            onSelectRow={(row) =>
              setSelectedUtenti(row.map((selectedItem) => selectedItem))
            }
            columns={tableProps.columns}
            data={tableProps.data}
            loading={tableProps.loading}
            onSort={(sort: SortingState) => {
              setSort({ table_id: 'utentiUfficio', sort })
            }}
          />
          <Drawer
            title={dictionary.get('aggiungiUtenti')}
            onClose={closeAggiungiUtenti}
            open={isOpenAggiungiUtenti}
          >
            <Utente drawer_id="aggiungiUtenti" />
          </Drawer>
          <Drawer
            title={dictionary.get('spostaUtenti')}
            onClose={() => {
              setDefaultValues({ default_values: null });
              closeMoveUsers();
            }}
            open={isOpenMoveUsers}
          >
            <SpostaUtenti
              drawer_id="spostaUtenti"
              onSave={onMoveUsers}
              loading={moveUsersLoading}
              selectedUtenti={selectedUtenti}
            />
          </Drawer>
          <ConfermaEliminaUtente
            title={dictionary.get('eliminaUtente')}
            bodyText={dictionary.get('confermaEliminaUtente', {
              name: content?.name || ''
            })}
            close={closeUtente}
            isOpen={isOpenUtente}
            onDelete={() => onDeleteUtente({ deletePermits: false })}
            onDeleteAll={() => onDeleteUtente({ deletePermits: true })}
            isLoading={isLoadingDeleteUtente}
            isLoadingAll={isLoadingDeleteUtentePermissions}
          />
          <DeleteDialog
            title={dictionary.get('eliminaUtenti')}
            bodyText={dictionary.get('confermaEliminaUtenti')}
            close={closeUtenti}
            isOpen={isOpenUtenti}
            onDelete={onDeleteUtenti}
            isLoading={isLoadingDeleteUtenti}
          />
        </Grid>
      </Card>
    </>
  );
};
