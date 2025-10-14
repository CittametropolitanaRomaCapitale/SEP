import { FCC } from "@cmrc/types/FCC";
import { useOffice } from "@cmrc/auth/useOffice";
import { useRifiutaProtocolloMutation } from "@cmrc/services/src/app/piapi/generated";
import toast from "@cmrc/ui/components/Toast";
import router from "next/router";
import { Grid, Typography, Stack, Button } from "@mui/material";
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator";
import { LoadingButton } from "@mui/lab";
import { useDialog } from "../../../../store/dialog/useDialog";
import { useGetQueryProtocolliList } from "../../../scrivania/lista_protocolli/hooks/useDataProtocolliList";
import { RifiutaProtocolloForm, useRifutaProtocolloForm } from "./hooks/useRifutaProtocolloForm";
import { dictionary } from "./dictionary";
import { useGetQueryReferentiProtocollo } from "../../assegnatari/hooks/useDataReferentiProtocollo";
import { useGetQueryStoricoList } from "../../storicizzazione/hooks/useDataStoricoList";
import { useGetQueryDettaglioProtocollo } from "../../useDataDettaglioProtocollo";

export interface RifiutaProtocolloProps {
  nProtocollo: string,
}

export const RifiutaProtocollo: FCC<RifiutaProtocolloProps> = ({ nProtocollo }) => {
  const { cdrCode } = useOffice();
  const { methods, structure } = useRifutaProtocolloForm();
  const queryProtocolliList = useGetQueryProtocolliList();
  const dettaglioQuery = useGetQueryDettaglioProtocollo();
  const queryStorico = useGetQueryStoricoList();
  const queryReferenti = useGetQueryReferentiProtocollo();
  const [rifiutaProtocollo, { isLoading }] = useRifiutaProtocolloMutation();

  const { close: closeDialog } = useDialog({
    dialog_id: `confermaRifiuta${nProtocollo}`
  });

  const handleRedirect = () => {
    if (router.asPath.includes(`/${nProtocollo}`)) {
      dettaglioQuery.refetch();
      queryStorico.refetch();
      queryReferenti.refetch();
    } else {
      queryProtocolliList.refetch();
    }
  }

  const onConfirm = async ({ motivazione }: RifiutaProtocolloForm) => {
    const response = await rifiutaProtocollo({
      nProtocollo,
      note: motivazione,
      selectedOffice: cdrCode
    }).unwrap();

    if (response?.rifiutaProtocollo) {
      toast.success(dictionary.get("rifiutaOk", { numero: `${nProtocollo}` }))
      handleRedirect();
      closeDialog();
    }
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
          {dictionary.get('aggiungereNota', { 'numero': `${nProtocollo}` })}
        </Typography>
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