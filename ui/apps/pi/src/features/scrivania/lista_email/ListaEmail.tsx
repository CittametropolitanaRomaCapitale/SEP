import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { useOffice } from '@cmrc/auth/useOffice';
import {
  EmailBaseFragment,
  useLazyGetPecPeoByTipologiaPostaQuery
} from '@cmrc/services/src/app/piapi/generated';
import { Dialog } from '@cmrc/ui/components/Dialog';
import toast from '@cmrc/ui/components/Toast';
import { SortingState } from '@tanstack/react-table';
import { useListaEmailTable } from './useListaEmailTable';
import { useGetQueryEmailList } from './hooks/useDataEmailList';
import { PaginationEmailList } from './PaginationEmailList';
import { EmailPreview } from '../../protocollo/allegati/EmailPreview';
import { dictionary } from './dictionary';
import { useHTTPRequests } from '../../../utils/network_utilities';
import { useWebSocketActions } from './actions/hooks/useWebSocketActions';
import { ListaEmailButtons } from './buttons/ListaEmailButtons';
import { EmailFormDialog } from './forms/form_rispondi_inoltra/EmailFormDialog';
import { useDialog } from '../../../store/dialog/useDialog';
import {
  StatoAssegnazione,
  StatoClassificazione,
  StatoLavorazionePec
} from '../../../utils/types';
import EnhancedTable from '../../../components/NewTable';
import { RicercaAvanzataPec } from './RicercaAvanzataPec';

export const ListaEmail = () => {
  const { user } = useAuth();
  const { cdr, cdrCode } = useOffice();
  const { query, isReady } = useRouter();
  const { data, isLoading, isFetching } = useGetQueryEmailList();
  const {
    columns,
    clearTable,
    setFilters,
    setSearch,
    setPage,
    setSelectedRows,
    setSort
  } = useListaEmailTable({ cdrCode, cdr });
  const [email, setEmail] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const { getRequest } = useHTTPRequests();
  const {
    connectWebSocket,
    disconnectWebSocket,
    sendMessageToWebSocket,
    onSycnronyze
  } = useWebSocketActions();
  const { open, close, isOpen } = useDialog({
    dialog_id: 'dialogDettaglioEmail'
  });

  const [getPecPeoByTipologiaPosta] = useLazyGetPecPeoByTipologiaPostaQuery();

  const [emailSelected, setEmailSelected] = useState(null);
  const [indirizzi, setIndirizzi] = useState(null);

  const getIndirizziEmail = async () => {
    const response = await getPecPeoByTipologiaPosta({
      tipologiaPosta: 'pec',
      selectedCdrCode: cdrCode
    }).unwrap();
    const indirizziResponse = response?.getPecPeoByTipologiaPosta;
    if (indirizziResponse.length > 0) {
      setIndirizzi(indirizziResponse);
      setEmailSelected([indirizziResponse[0]]);
      if (!query?.indirizziEmail) {
        setFilters({
          isClassificato: [StatoClassificazione.NON_CLASSIFICATO],
          isAssegnato: [StatoAssegnazione.NON_ASSEGNATO],
          // mostraNonLavorate: [StatoLavorazionePec.NON_LAVORATE],
          // emailDirection: [EmailDirection.Entrata],
          // tipoEmail: [TipologiaPosta.Pec],
          indirizziEmail: [indirizziResponse[0]]
        });
      }
    } else {
      setIndirizzi([]);
      setEmailSelected('');
    }
  };

  const handleRowClick = ({ original }: { original: EmailBaseFragment }) => {
    setSelectedRow(original);
    // recupera l'email in formato byte[]
    if (original?.id) {
      getRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/allegato/eml/${original.id}`,
        (response) => {
          try {
            if (response?.data) {
              open();
              setEmail(response.data);
            } else {
              throw new Error(dictionary.get('responseDettaglioEmailKO'));
            }
          } catch (error) {
            toast.error(error.message);
            close();
          }
        }
      );
    }
  };

  useEffect(() => {
    if (!isReady) return undefined;

    const {
      indirizziEmail,
      isClassificato,
      isAssegnato,
      mostraNonLavorate,
      ...advancedFilters
    } = query || {};

    const isEmptyQuery = Object.keys(query).length === 0;

    setFilters({
      advancedFilters: Object.keys(advancedFilters)?.length
        ? { ...advancedFilters }
        : undefined,
      indirizziEmail:
        indirizziEmail !== undefined
          ? String(indirizziEmail)?.split(',')
          : undefined,
      isClassificato:
        isClassificato !== undefined
          ? String(isClassificato)?.split(',')
          : isEmptyQuery
          ? [StatoClassificazione.NON_CLASSIFICATO]
          : null,
      isAssegnato:
        isAssegnato !== undefined
          ? String(isAssegnato)?.split(',')
          : isEmptyQuery
          ? [StatoAssegnazione.NON_ASSEGNATO]
          : null,
      mostraNonLavorate:
        mostraNonLavorate !== undefined
          ? String(mostraNonLavorate)?.split(',')
          : undefined
    });

    connectWebSocket(user?.username);
    setSearch(String(query?.search || ''));
    setPage(Number(query?.page) || 0);

    getIndirizziEmail();

    return () => {
      disconnectWebSocket();
      close();
    };
  }, [isReady]);

  const handleSync = () => {
    if (emailSelected === null) {
      toast.warn(dictionary.get('noMailAvailable'));
      return;
    }
    Object.values(emailSelected).map((emailSel: string) =>
      sendMessageToWebSocket(
        user?.username,
        JSON.stringify({ message: 'produce', email: emailSel })
      )
    );
  };

  const handleIndirizziSelected = (list: any[]) => {
    setEmailSelected(list);
  };

  useEffect(
    () => () => {
      /** clean up */
      clearTable();
    },
    []
  );

  return (
    <Card sx={{ padding: 0 }}>
      <Grid sx={{ width: 1 }}>
        <Dialog
          title={dictionary.get('dettaglioEmail')}
          open={isOpen}
          onClose={close}
        >
          <EmailPreview
            selectedRow={selectedRow}
            email={email}
            isDettaglioEmail
          />
        </Dialog>
        <Grid container direction="column" spacing={2}>
          <Grid item container justifyContent="flex-end" sx={{ mt: 2 }}>
            <RicercaAvanzataPec />
          </Grid>
          <Grid item>
            <TableTopBar
              leftElement={
                <ListaEmailButtons
                  onSync={handleSync}
                  isLoading={onSycnronyze}
                  onIndirizziSelected={handleIndirizziSelected}
                  indirizziEmail={indirizzi}
                  isDisabled={
                    emailSelected === null || emailSelected.length === 0
                  }
                />
              }
              rightElement={<PaginationEmailList />}
            />
          </Grid>
        </Grid>
        <EnhancedTable
          columns={columns}
          data={
            emailSelected === null || emailSelected.length === 0
              ? []
              : data?.getEmails?.email
          }
          loading={isLoading || isFetching}
          onSelectRow={(row) => setSelectedRows(row)}
          emptyTableText={
            emailSelected === null
              ? dictionary.get('tabellaInCaricamento')
              : emailSelected.length > 0
              ? dictionary.get('tabellaVuotaTesto')
              : dictionary.get('noMailAvailable')
          }
          onRowClick={(row) => handleRowClick(row)}
          defaultSort={[{ id: 'tsInvio', desc: true }]}
          onSort={(sort: SortingState) => {
            setSort({ table_id: 'listaEmail', sort });
          }}
        />
        <EmailFormDialog />
      </Grid>
    </Card>
  );
};
