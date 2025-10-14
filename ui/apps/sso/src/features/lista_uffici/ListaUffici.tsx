import { useEffect } from 'react';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@cmrc/ui/components/Drawer';
import { useRouter } from 'next/router';
import { SortingState } from '@tanstack/react-table';
import { dictionary } from './dictionary';
import { useListaUfficiTable } from './useListaUfficiTable';
import FiltriUffici from './FiltriUffici';
import EnhancedTable from '../../components/EnhancedTable';
import Pagination from '../../components/Pagination';
import { useDrawer } from '../../store/drawer/useDrawer';
import Ufficio from './ufficio/Ufficio';
import { useFormState } from '../../store/form/useForm';

export const ListaUffici = () => {
  const router = useRouter();
  const { data, tableProps, clearTable, setSort: setSortTable } = useListaUfficiTable();

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
    drawer_id: 'creaUfficio'
  });

  const { closeDrawer: closeEdit, isOpenDrawer: isOpenEdit } = useDrawer({
    drawer_id: 'modificaUfficio'
  });

  const { setDefaultValues } = useFormState({
    form_id: 'formUfficio'
  });

  return (
    <>
      <Grid sx={{ m: 2, display: 'flex', justifyContent: 'right' }}>
        <Button
          onClick={openCreate}
          size="small"
          sx={{ mr: 1 }}
          variant="outlined"
          aria-label="crea-ufficio"
        >
          {dictionary.get('creaUfficio')}
        </Button>
      </Grid>
      <Card sx={{ padding: 0 }}>
        <Grid sx={{ width: 1 }}>
          <TableTopBar
            leftElement={
              <Stack direction="row" spacing={2} alignItems="baseline">
                <FiltriUffici loading={tableProps?.loading} />
              </Stack>
            }
            rightElement={
              <Pagination table_id="listaUffici" count={data?.pages} />
            }
          />
          <EnhancedTable
            onRowClick={({ original }) => router.push(`/uffici/${original.id}`)}
            emptyTableText={dictionary.get('tabellaVuotaTesto')}
            columns={tableProps.columns}
            data={tableProps.data}
            loading={tableProps.loading}
            onSort={(sort: SortingState) => {
              setSortTable({ table_id: 'listaUffici', sort })
            }}
          />
          <Drawer
            title={dictionary.get('creaUfficio')}
            onClose={() => {
              setDefaultValues({ default_values: null });
              closeCreate();
            }}
            open={isOpenCreate}
          >
            <Ufficio drawer_id="creaUfficio" />
          </Drawer>
          <Drawer
            title={dictionary.get('modificaUfficio')}
            onClose={() => {
              setDefaultValues({ default_values: null });
              closeEdit();
            }}
            open={isOpenEdit}
          >
            <Ufficio drawer_id="modificaUfficio" />
          </Drawer>
        </Grid>
      </Card>
    </>
  );
};
