import Grid from "@mui/material/Grid"
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator"
import Button from "@mui/material/Button"
import LoadingButton from "@mui/lab/LoadingButton"
import { useState } from "react"
import { ProtocolloBaseFragment, RaccomandataBaseFragment, RaccomandataProtocolloInputInput, useInsertRaccomandataMutation } from "@cmrc/services/src/app/piapi/generated"
import toast from "@cmrc/ui/components/Toast"
import { useRaccomandataForm } from "./hooks/useRaccomandataForm"
import { useDialog } from "../../../../store/dialog/useDialog"
import { dictionary } from "../dictionary"
import { useGetQueryRaccomandateProtocolloList } from "../hooks/useDataRaccomandateProtocollo"
import { useGetQueryStoricoList } from "../../storicizzazione/hooks/useDataStoricoList"
import { RiepilogoRaccomandata } from "./RiepilogoRaccomandata"

interface RaccomandataFormProps {
  defaultvalues?: RaccomandataBaseFragment;
  protocolloData?: ProtocolloBaseFragment;
  readMode?: boolean;
}

export const RaccomandataForm: React.FC<RaccomandataFormProps> = ({ protocolloData, defaultvalues, readMode }) => {
  const { structure, methods } = useRaccomandataForm(defaultvalues, readMode)
  // const { initialData, initialAllegati } = InitialDataProvider(readMode);
  const [insertRaccomandata] = useInsertRaccomandataMutation()
  const { refetch: refetchRaccomandate } = useGetQueryRaccomandateProtocolloList();
  const { refetch: refetchStorico } = useGetQueryStoricoList();
  const [isSaving, setIsSaving] = useState(false)
  const { close } = useDialog({
    dialog_id: 'raccomandataDialog'
  })

  const onSave = async ({ ...values }: any) => {
    setIsSaving(true);
    const excludeParamSave = ['destinatarioSection', 'documentoSection', 'mittenteSection', 'tipologiaInvioSection']
    const formData: RaccomandataProtocolloInputInput = { ...values };
    // svuoto i campi non necessari
    excludeParamSave.forEach(param => delete formData[param]);

    formData.idProtocollo = protocolloData?.id;
    formData.destinatarioCap = values.destinatarioCap?.label;
    formData.destinatarioCitta = values.destinatarioCitta?.label;

    //Caso in cui via sia stata scritta a mano senza essere selezionata dall'autocomplete!
    formData.destinatarioIndirizzo = values.destinatarioIndirizzo?.label !== undefined ? values.destinatarioIndirizzo?.label : values.destinatarioIndirizzo;

    if (!formData?.idAllegato) {
      setIsSaving(false);
      return;
    }

    // SALVATAGGIO DELLA RACCOMANDATA
    let response = null;
    try {
      response = await insertRaccomandata({ input: formData }).unwrap();
      if (response?.insertRaccomandata?.id) {
        toast.success(dictionary.get('raccomandataOK'));
        setIsSaving(false);
        refetchRaccomandate();
        refetchStorico();
        close();
      }
    } catch (error) {
      toast.error(dictionary.get('raccomandataKO'));
      setIsSaving(false);
    }
  }

  return (
    <Grid
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 0 }}
    >
      <RiepilogoRaccomandata defaultValues={defaultvalues} hidden={!readMode} />
      <Grid item>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      {!readMode && (
        <Grid item>
          <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
            <Button
              onClick={close}
              size="small"
              disabled={isSaving}
              sx={{ height: '30px', mr: 1 }}
            >
              {dictionary.get('annulla')}
            </Button>
            <LoadingButton
              onClick={methods.handleSubmit((values) => onSave(values))}
              loading={isSaving}
              size="small"
              variant="contained"
              sx={{ height: '30px' }}
            >
              {dictionary.get('invia')}
            </LoadingButton>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}