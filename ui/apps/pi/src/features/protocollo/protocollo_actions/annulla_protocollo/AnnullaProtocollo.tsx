import { FCC } from "@cmrc/types/FCC";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "@cmrc/ui/components/Toast";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { ProtocolloBaseFragment, useAnnullaProtocolloMutation, useRichiestaAnnullamentoProtocolloMutation } from "@cmrc/services/src/app/piapi/generated";
import { useRouter } from "next/router";
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator";
import { LoadingButton } from "@mui/lab";
import { useDialog } from "../../../../store/dialog/useDialog";
import { AnnullaProtocolloForm, useAnnullaProtocolloForm } from "./hooks/useAnnullaProtocolloForm";
import { useGetQueryProtocolliList } from "../../../scrivania/lista_protocolli/hooks/useDataProtocolliList";
import { useGetQueryStoricoList } from "../../storicizzazione/hooks/useDataStoricoList";
import { useGetQueryDettaglioProtocollo } from "../../useDataDettaglioProtocollo";
import { dictionary } from "./dictionary";
import { useGetQueryReferentiProtocollo } from "../../assegnatari/hooks/useDataReferentiProtocollo";

export interface AnnullaProtocolloProps {
  action: string
  protocolloData: ProtocolloBaseFragment,
}

export const AnnullaProtocollo: FCC<AnnullaProtocolloProps> = ({ action, protocolloData }) => {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  const [dialogDescription, setDialogDescription] = useState();
  const [isAnnullaAction] = useState(action === dictionary.get('annullaAction'));
  const queryProtocolliList = useGetQueryProtocolliList();
  const dettaglioQuery = useGetQueryDettaglioProtocollo();
  const queryReferenti = useGetQueryReferentiProtocollo();
  const queryStorico = useGetQueryStoricoList();

  const { methods, structure } = useAnnullaProtocolloForm();
  const [annullaProtocollo] = useAnnullaProtocolloMutation();
  const [richiestaAnnullamento] = useRichiestaAnnullamentoProtocolloMutation();

  const { close: closeDialog } = useDialog({
    dialog_id: 'dialogAnnulla'
  });

  useEffect(() => {
    if (action) {
      setDialogDescription(isAnnullaAction ? dictionary.get('motivazioneAnnullamento', { 'numero': `${protocolloData?.nProtocollo}` }) : dictionary.get('motivazioneRichiestaAnnullamento', { 'numero': `${protocolloData?.nProtocollo}` }));
    }
  }, [action, isAnnullaAction]);

  const handleRefetch = () => {
    if (router.asPath.includes(`/${protocolloData?.nProtocollo}`)) {
      dettaglioQuery.refetch();
      queryStorico.refetch();
      queryReferenti.refetch();
    } else {
      queryProtocolliList.refetch();
    }
  }

  const onConfirm = async ({ motivazione }: AnnullaProtocolloForm) => {
    setIsloading(true)
    const idProtocollo = protocolloData?.id;
    try {
      if (isAnnullaAction) {
        const responseAnnulla = await annullaProtocollo({
          idProtocollo,
          notaAnnullamento: motivazione
        }).unwrap();

        if (responseAnnulla?.annullaProtocollo) {
          toast.success(dictionary.get('annullaOk', { 'numero': `${protocolloData?.nProtocollo}` }));
          handleRefetch();
        }
      } else {
        const responseRichiestaAnnulla = await richiestaAnnullamento({
          idProtocollo,
          notaAnnullamento: motivazione
        }).unwrap();

        if (responseRichiestaAnnulla?.richiestaAnnullamentoProtocollo) {
          toast.success(dictionary.get('richiestaOk'));
          handleRefetch();
        }
      }

    } catch (error) {
      setIsloading(false)
    }
    closeDialog();
    setIsloading(false)
  }

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 5 }}
    >
      <Grid item>
        <Typography sx={{ pb: 1 }}>
          {dialogDescription}
        </Typography>
        {!isAnnullaAction &&
          <Typography variant="body2" sx={(theme) => ({ pb: 1, textDecoration: 'underline', fontWeight: 700, color: theme.palette.grey[600] })}>
            {dictionary.get('motivazioneRichiestaAnnullamentoSub')}
          </Typography>
        }
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid item>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end"  >
          <Button
            onClick={closeDialog}
            size="small"
            variant="outlined"
          >
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            size="small"
            variant="contained"
            onClick={methods.handleSubmit((values) => onConfirm(values))}
            loading={isLoading}>
            {dictionary.get('conferma')}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  )
}