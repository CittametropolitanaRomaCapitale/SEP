import { FCC } from '@cmrc/types/FCC';
import toast from '@cmrc/ui/components/Toast';
import { Button, Grid, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import {
  ProtocolloBaseFragment,
  ReferenteOutputDto,
  ReferenteProtocolloInputInput,
  useAssegnaProtocolloMutation
} from '@cmrc/services/src/app/piapi/generated';
import { useRouter } from 'next/router';
import { useOffice } from '@cmrc/auth/useOffice';
import { useDialog } from '../../../../store/dialog/useDialog';
import { useAssegnaForm } from './forms/useAssegnaForm';
import { useGetQueryProtocolliList } from '../../../scrivania/lista_protocolli/hooks/useDataProtocolliList';
import { dictionary } from './dictionary';
import { useGetQueryReferentiProtocollo } from '../../assegnatari/hooks/useDataReferentiProtocollo';
import { useGetQueryStoricoList } from '../../storicizzazione/hooks/useDataStoricoList';
import { useGetQueryDettaglioProtocollo } from '../../useDataDettaglioProtocollo';

export interface AssegnaProtocolloProps {
  protocolloData: ProtocolloBaseFragment;
}

export const AssegnaProtocollo: FCC<AssegnaProtocolloProps> = ({
  protocolloData
}) => {
  const router = useRouter();
  const { cdrCode } = useOffice();
  const queryProtocolliList = useGetQueryProtocolliList();
  const dettaglioQuery = useGetQueryDettaglioProtocollo();
  const queryStorico = useGetQueryStoricoList();
  const queryReferenti = useGetQueryReferentiProtocollo();

  const { methods, structure } = useAssegnaForm(protocolloData);
  const [assegnaProtocolloMutation, { isLoading }] =
    useAssegnaProtocolloMutation();
  const { close: closeDialog } = useDialog({
    dialog_id: 'dialogAssegnaProtocolloForm'
  });

  const handleCloseDialog = () => {
    closeDialog();
  };

  const handleRedirect = () => {
    if (router.asPath.includes(`/${protocolloData?.nProtocollo}`)) {
      dettaglioQuery.refetch();
      queryStorico.refetch();
      queryReferenti.refetch();
    } else {
      queryProtocolliList.refetch();
    }
  };

  const onSave = async ({ ...values }: any) => {
    const idProtocollo = protocolloData?.id;
    const assegnatari: ReferenteProtocolloInputInput[] =
      values?.assegnatari?.map((item) => ({
        idAssegnatario: item?.idDestinatario,
        nomeAssegnatario: item?.label,
        tipoDestinatario: item?.tipo,
        cdrAssegnatario: item?.cdrAssegnatario
      }));
    const response = await assegnaProtocolloMutation({
      idProtocollo,
      assegnatari,
      noteAssegnazione: values?.noteAssegnazione,
      selectedOffice: cdrCode
    }).unwrap();
    if (response?.assegnaProtocollo) {
      toast.success(
        dictionary.get('assegnazioneOK', {
          numero: `${protocolloData?.nProtocollo}`
        })
      );
      handleRedirect();
      closeDialog();
    }
  };

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 5 }}
    >
      <Grid item>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid item>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          justifyContent="flex-end"
        >
          <Button onClick={handleCloseDialog} size="small" variant="outlined">
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            onClick={methods.handleSubmit((values) => onSave(values))}
            size="small"
            variant="contained"
            loading={isLoading}
          >
            {dictionary.get('assegna')}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};
