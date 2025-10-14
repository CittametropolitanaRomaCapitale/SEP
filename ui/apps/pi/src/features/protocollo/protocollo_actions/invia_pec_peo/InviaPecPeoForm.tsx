import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Stack
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import {
  NotificaProtocolloPecPeoInputInput,
  TipologiaPosta,
  TipoRegistrazione,
  useNotificaProtocolloMutation
} from '@cmrc/services/src/app/piapi/generated';
import { useState } from 'react';
import toast from '@cmrc/ui/components/Toast';
import { useRouter } from 'next/router';
import { dictionary } from './dictionary';
import { useDialog } from '../../../../store/dialog/useDialog';
import { useInviaPecPeoForm } from './hooks/useInviaPecPeoForm';
import { useGetQueryStoricoList } from '../../storicizzazione/hooks/useDataStoricoList';

export const InviaPecPeoForm = ({ dettaglioProtocollo, tipologiaPosta }) => {
  const { close: closeEmailDialog } = useDialog({
    dialog_id: 'dialogEmailForm'
  });
  const router = useRouter();
  const [inviaPecPeoMutation, { isLoading }] = useNotificaProtocolloMutation();
  const [isError, setIsError] = useState(false);
  const queryStorico = useGetQueryStoricoList();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRedirect = () => {
    if (
      router.asPath.includes(`/${dettaglioProtocollo?.protocollo?.nProtocollo}`)
    )
      queryStorico.refetch();
  };

  const buildInviaPecPeoFormData = (obj) => {
    return {
    idProtocollo: obj?.protocollo?.id,
    nProtocollo: obj?.protocollo?.nProtocollo,
    oggetto: obj?.protocollo?.oggetto,
    from: '',
    allegati: obj?.protocollo?.allegati.map((allegato) => ({
      id: allegato?.id,
      tipoDocumento: allegato?.tipoDocumento,
      oggetto: allegato?.oggetto,
      nome: allegato?.nome,
      estensione: allegato?.estensione
    })),
    // solo in caso di protocollo in uscita recupero i destinatari pc e cc e li imposto di default nel form
    destinatariCompetenza:
      obj?.protocollo?.tipoRegistrazione === TipoRegistrazione.Uscita && (obj.protocollo?.metodoSpedizione.toLowerCase() === tipologiaPosta.toLowerCase())
        ? obj?.destinatariCompetenza
        : null,
    destinatariConoscenza:
      obj?.protocollo?.tipoRegistrazione === TipoRegistrazione.Uscita && (obj.protocollo?.metodoSpedizione.toLowerCase() === tipologiaPosta.toLowerCase())
        ? obj?.destinatariConoscenza
        : null,
    multiplo: false,
    tipologia: tipologiaPosta
  }};

  const { methods, structure } = useInviaPecPeoForm(
    buildInviaPecPeoFormData(dettaglioProtocollo),
    tipologiaPosta
  );

  const onSave = async ({ ...values }: any) => {
    const excludeParamSave = ['headerUtente', 'destinatari'];
    const formData: NotificaProtocolloPecPeoInputInput = {
      ...values
    };
    // svuoto i campi non necessari
    excludeParamSave.forEach((param) => delete formData[param]);


    formData.destinatariCompetenzaUsePeoInsteadOfPec = [];
    formData.destinatariConoscenzaUsePeoInsteadOfPec = [];

    const destinatariCompetenzaToSend = [];
    const destinatariConoscenzaToSend = [];
    for(let i=0;i<formData.destinatariCompetenza.length;i++) {
      let destinatarioCompetenzaToSend = Object.assign({}, formData.destinatariCompetenza[i]);
      if (destinatarioCompetenzaToSend['usePeoForSendEmail']) {
        formData.destinatariCompetenzaUsePeoInsteadOfPec.push(destinatarioCompetenzaToSend.idDestinatario);
      }
      delete destinatarioCompetenzaToSend['usePeoForSendEmail'];
      destinatariCompetenzaToSend.push(destinatarioCompetenzaToSend);
    }
    formData.destinatariCompetenza = destinatariCompetenzaToSend;
    
    if (formData.destinatariConoscenza !== null) {
      for(let i=0;i<formData.destinatariConoscenza.length;i++) {
        let destinatarioConoscenzaToSend = Object.assign({}, formData.destinatariConoscenza[i]);
        if (destinatarioConoscenzaToSend['usePeoForSendEmail']) {
          formData.destinatariConoscenzaUsePeoInsteadOfPec.push(destinatarioConoscenzaToSend.idDestinatario);
        }
        delete destinatarioConoscenzaToSend['usePeoForSendEmail'];
        destinatariConoscenzaToSend.push(destinatarioConoscenzaToSend);
      }
      formData.destinatariConoscenza = destinatariConoscenzaToSend;
    }

    //console.log(formData);
    //return;

    const response = await inviaPecPeoMutation({ input: formData }).unwrap();
    if (response?.notificaProtocollo) {
      toast.success(dictionary.get('invioPecPeoOK'));
      handleRedirect();
      closeEmailDialog();
    }
  };

  return (
    <Grid
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 1 }}
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
          <Button onClick={handleClickOpen} size="small" variant="text">
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            onClick={methods.handleSubmit((values) => onSave(values))}
            size="small"
            variant="contained"
            loading={isLoading}
          >
            {dictionary.get('invia')}
          </LoadingButton>
        </Stack>
        <Dialog fullWidth={false} open={open} onClose={handleClose}>
          <DialogContent>{dictionary.get('confermaAnnulla')}</DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {dictionary.get('annulla')}
            </Button>
            <LoadingButton onClick={closeEmailDialog} color="primary">
              {dictionary.get('conferma')}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};
