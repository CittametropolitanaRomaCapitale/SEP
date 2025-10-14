import { useState } from "react";
import { FCC } from "@cmrc/types/FCC";
import toast from "@cmrc/ui/components/Toast";
import { Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator";
import LoadingButton from "@mui/lab/LoadingButton";
import { ProtocolloBaseFragment, useGestioneAnnullamentoMutation } from "@cmrc/services/src/app/piapi/generated";
import { useDialog } from "../../../../store/dialog/useDialog";
import { useGetQueryProtocolliList } from "../../../scrivania/lista_protocolli/hooks/useDataProtocolliList";
import { useGetQueryStoricoList } from "../../storicizzazione/hooks/useDataStoricoList";
import { useGetQueryDettaglioProtocollo } from "../../useDataDettaglioProtocollo";
import { GestioneAnnullamentoForm, useGestisciAnnullamentoForm } from "./hooks/useGestisciAnnullamentoForm";
import { dictionary } from "./dictionary";
import { useGetQueryReferentiProtocollo } from "../../assegnatari/hooks/useDataReferentiProtocollo";

export interface GestisciAnnullamentoProps {
  protocolloData: ProtocolloBaseFragment,
}

export const GestisciAnnullamentoForm: FCC<GestisciAnnullamentoProps> = ({ protocolloData }) => {
  const router = useRouter();
  const [isLoadingAnnulla, setIsLoadingAnnulla] = useState(false);
  const [disableAction, setDisableAction] = useState(undefined);

  const queryProtocolliList = useGetQueryProtocolliList();
  const queryReferenti = useGetQueryReferentiProtocollo();
  const dettaglioQuery = useGetQueryDettaglioProtocollo();
  const queryStorico = useGetQueryStoricoList();

  const { methods, structure } = useGestisciAnnullamentoForm();
  const [gestioneannullamento] = useGestioneAnnullamentoMutation();

  const { close: closeDialog } = useDialog({
    dialog_id: 'dialogGestioneAnnullamento'
  });

  const handleButtonDisabled = (isAnnullaConfirmed: boolean) => {
    const disabled = isAnnullaConfirmed ? dictionary.get('conferma') : dictionary.get('rifiuta');
    setDisableAction(disabled);
  }

  const handleRefetch = () => {
    if (router.asPath.includes(`/${protocolloData?.nProtocollo}`)) {
      dettaglioQuery.refetch();
      queryStorico.refetch();
      queryReferenti.refetch();
    } else {
      queryProtocolliList.refetch();
    }
  }

  const onConfirm = async ({ motivazione }: GestioneAnnullamentoForm, isAnnullaConfirmed: boolean) => {
    setIsLoadingAnnulla(true);
    handleButtonDisabled(isAnnullaConfirmed)

    try {
      const response = await gestioneannullamento({
        idProtocollo: protocolloData?.id,
        isAnnulla: isAnnullaConfirmed,
        nota: motivazione
      }).unwrap();

      if (response?.gestioneAnnullamento) {
        const confirmMessage = isAnnullaConfirmed ? (dictionary.get('annullaOk', { 'numero': `${protocolloData?.nProtocollo}` })) : dictionary.get('rifiutaOk');
        toast.success(confirmMessage);
        handleRefetch();
      }

    } catch (error) {
      setIsLoadingAnnulla(false);
    }
    closeDialog();
    setIsLoadingAnnulla(false);
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
          {dictionary.get('labelGestioneAnnullamento')}
        </Typography>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid item>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end"  >
          <LoadingButton
            loading={isLoadingAnnulla && disableAction === dictionary.get('rifiuta')}
            disabled={disableAction === dictionary.get('conferma')}
            onClick={methods.handleSubmit((values) => onConfirm(values, false))}
            size="small"
            variant="outlined"
          >
            {dictionary.get('rifiuta')}
          </LoadingButton>
          <LoadingButton
            loading={isLoadingAnnulla && disableAction === dictionary.get('conferma')}
            disabled={disableAction === dictionary.get('rifiuta')}
            size="small"
            variant="contained"
            onClick={methods.handleSubmit((values) => onConfirm(values, true))}
          >
            {dictionary.get('conferma')}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  )
}