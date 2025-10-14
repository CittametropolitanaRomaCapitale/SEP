import { FCC } from '@cmrc/types/FCC';
import toast from '@cmrc/ui/components/Toast';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import {
  ProtocolloBaseFragment,
  useUpdateNoteProtocolloMutation
} from '@cmrc/services/src/app/piapi/generated';
import { useRouter } from 'next/router';
import { useDialog } from '../../../../store/dialog/useDialog';
import { useNoteForm } from './forms/useNoteForm';
import { useGetQueryProtocolliList } from '../../../scrivania/lista_protocolli/hooks/useDataProtocolliList';
import { dictionary } from './dictionary';
import { useGetQueryStoricoList } from '../../storicizzazione/hooks/useDataStoricoList';
import { useGetQueryDettaglioProtocollo } from '../../useDataDettaglioProtocollo';

export interface NoteProtocolloProps {
  protocolloData: ProtocolloBaseFragment;
}

export const NoteProtocollo: FCC<NoteProtocolloProps> = ({
  protocolloData
}) => {
  const router = useRouter();
  const queryProtocolliList = useGetQueryProtocolliList();
  const dettaglioQuery = useGetQueryDettaglioProtocollo();
  const queryStorico = useGetQueryStoricoList();

  const { methods, structure } = useNoteForm(protocolloData);
  const [updateNoteProtocollo, { isLoading }] =
    useUpdateNoteProtocolloMutation();
  const { close: closeDialog } = useDialog({
    dialog_id: 'dialogNoteProtocollo'
  });

  const handleCloseDialog = () => {
    closeDialog();
  };

  const handleRedirect = () => {
    if (router.asPath.includes(`/${protocolloData?.nProtocollo}`)) {
      dettaglioQuery.refetch();
      queryStorico.refetch();
    } else {
      queryProtocolliList.refetch();
    }
  };

  const onSave = async ({ ...values }: any) => {
    const response = await updateNoteProtocollo({
      input: {
        nProtocollo: protocolloData?.nProtocollo,
        note: values?.note
      }
    }).unwrap();
    if (response?.updateNoteProtocollo) {
      toast.success(
        dictionary.get('updateNoteOK', {
          numero: `${protocolloData?.nProtocollo}`
        })
      );
      handleRedirect();
      closeDialog();
    }
  };

  console.log(protocolloData?.nProtocollo);

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 5 }}
    >
      <Grid item>
        <Typography>{dictionary.get('msgDescrizione', {'n_protocollo': protocolloData?.nProtocollo})}</Typography>
      </Grid>
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
            {dictionary.get('salva')}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};
