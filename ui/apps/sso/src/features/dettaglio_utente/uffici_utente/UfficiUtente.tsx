import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Drawer from '@cmrc/ui/components/Drawer';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import { useDeleteApiOfficeByOfficeIdAndUserIdMutation } from '@cmrc/services/sso';
import toast from '@cmrc/ui/components/Toast';
import { useRouter } from 'next/router';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import { SortingState } from '@tanstack/react-table';
import Pagination from '../../../components/Pagination';
import { useDrawer } from '../../../store/drawer/useDrawer';
import { dictionary } from './dictionary';
import FiltriUfficiUtente from './FiltriUfficiUtente';
import { useUfficiUtenteTable } from './useUfficiUtenteTable';
import AggiungiUffici from './aggiungi_ufficio/AggiungiUffci';
import { useDialog } from '../../../store/dialog/useDialog';
import { ConfermaEliminaUfficio } from './ConfermaEliminaUfficio';
import EnhancedTable from '../../../components/EnhancedTable';

export const UfficiUtente = () => {
  const { query } = useRouter();
  const { data, tableProps, clearTable, setSort: setSortTable } = useUfficiUtenteTable();

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
    drawer_id: 'aggiungiUfficiUtente'
  });

  const { isOpen, close, content } = useDialog({
    dialog_id: 'rimuoviUfficio'
  });

  const [deleteOfficeMutation, { isLoading: isLoadingDelete }] =
    useDeleteApiOfficeByOfficeIdAndUserIdMutation();

  const [
    deleteOfficePermissionsMutation,
    { isLoading: isLoadingDeletePermissions }
  ] = useDeleteApiOfficeByOfficeIdAndUserIdMutation();

  const onDelete = ({ deletePermits }: { deletePermits: boolean }) => {
    if (deletePermits) {
      deleteOfficePermissionsMutation({
        officeId: content?.id,
        userId: Number(query?.id),
        removeUserFromOfficeInput: {
          deletePermits
        }
      })
        .unwrap()
        .then(() => {
          toast.success(dictionary.get('ufficioPermessiRimossi'));
          close();
        })
        .catch(() => {
          toast.error(dictionary.get('ufficioErrore'));
        })
        .finally(() => {
          close();
        });
    } else {
      deleteOfficeMutation({
        officeId: content?.id,
        userId: Number(query?.id),
        removeUserFromOfficeInput: {
          deletePermits
        }
      })
        .unwrap()
        .then(() => {
          toast.success(dictionary.get('ufficioRimosso'));
        })
        .catch(() => {
          toast.error(dictionary.get('ufficioErrore'));
        })
        .finally(() => {
          close();
        });
    }
  };

  return (
    <>
      <TableExternalHeader
        title={dictionary.get('uffici')}
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
              aria-label="aggiungi-uffici"
            >
              {dictionary.get('aggiungiUffici')}
            </Button>
            <Pagination table_id="ufficiUtente" count={data?.pages} />
          </Grid>
        }
      />
      <Card sx={{ mb: 4, pt: 2 }}>
        <Grid sx={{ width: 1 }}>
          <TableTopBar
            leftElement={
              <Stack direction="row" spacing={2} alignItems="baseline">
                <FiltriUfficiUtente loading={tableProps?.loading} />
              </Stack>
            }
          />
          <EnhancedTable
            columns={tableProps?.columns}
            data={tableProps?.data}
            emptyTableText={dictionary.get('tabellaVuotaTesto')}
            loading={tableProps?.loading}
            onSort={(sort: SortingState) => {
              setSortTable({ table_id: 'ufficiUtente', sort })
            }}
            {...tableProps}
          />
          <Drawer
            title={dictionary.get('aggiungiUffici')}
            onClose={closeCreate}
            open={isOpenCreate}
          >
            <AggiungiUffici />
          </Drawer>
          <ConfermaEliminaUfficio
            title={dictionary.get('rimuoviUfficio')}
            bodyText={dictionary.get('confermaRimuoviUfficio', {
              name: content?.name || ''
            })}
            close={close}
            isOpen={isOpen}
            onDelete={() => onDelete({ deletePermits: false })}
            onDeleteAll={() => onDelete({ deletePermits: true })}
            isLoading={isLoadingDelete}
            isLoadingAll={isLoadingDeletePermissions}
          />
        </Grid>
      </Card>
    </>
  );
};
