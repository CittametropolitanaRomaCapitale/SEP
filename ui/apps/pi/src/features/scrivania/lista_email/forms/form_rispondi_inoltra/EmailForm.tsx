import { useState } from "react";
import toast from "@cmrc/ui/components/Toast";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReplyIcon from '@mui/icons-material/Reply';
import { Button, Grid, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Allegato, useInoltraRispondiEmailMutation } from "@cmrc/services/src/app/piapi/generated";
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator";
import { EmailFormData, useEmailForm } from "./hooks/useEmailForm";
import { HeaderUtente } from "./HeaderUtente";
import { dictionary } from "./dictionary";
import { useDialog } from "../../../../../store/dialog/useDialog";
import { useAppSelector } from "../../../../../store/hooks";
import { useGetEmailFormInitialData } from "./hooks/useGetEmailFormInitialData";
import { extractValuesFromArray } from "../../../../../utils/email_utilities";

export const EmailForm = () => {
  const emailData = useAppSelector((state) => state.email.emailData);
  const emailAction = useAppSelector((state) => state.email.inoltraRispondi);
  const {initialData } = useGetEmailFormInitialData(emailData, emailAction);
  const { methods, structure } = useEmailForm(initialData);
  const [attachments, setAttachments] = useState<Allegato[]>([]);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [sendMail] = useInoltraRispondiEmailMutation() 
  const { close:closeDialog } = useDialog({
    dialog_id: 'dialogEmailForm'
  });

  const handleCloseDialog = () => {
    closeDialog();
  }

  const onSave = async ({...values}:EmailFormData) => {
    setIsLoadingSave(true);

    const input = {
      from: initialData.from,
      subject: values.oggetto,
      to: extractValuesFromArray(values.destinatariTo),
      cc: extractValuesFromArray(values.destinatariCc),
      body: values.corpo,
      idAttachments: values.idAttachments,
      tipologiaPosta: values.tipologiaPosta
    }
      
    try {
      const response = await sendMail({ dto: input }).unwrap();
      if (response?.inoltraRispondiEmail) {
        toast.success('Invio riuscito');
        closeDialog();
      }
    } catch (error) {
      toast.error(error)
      setIsLoadingSave(false);
    } finally {
      setIsLoadingSave(false);
    }
  }

  const getEndIcon = () => emailAction === dictionary.get('rispondi') ? <ReplyIcon /> : <ArrowForwardIcon />;
 
  return (
      <Grid
        container
        direction="column"
        rowSpacing={3}
        sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 5 }}
      >
        <HeaderUtente/>
        <Grid item>
          <FormGenerator methods={methods} structure={structure} />
        </Grid>
        <Grid item>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end"  >
            <Button
              onClick={handleCloseDialog}
              size="small"
              variant="text"
            >
              {dictionary.get('chiudi')}
            </Button>
            <LoadingButton
              onClick={methods.handleSubmit((values) => onSave(values))}
              size="small"
              variant="contained"
              loading={isLoadingSave}
              endIcon={getEndIcon()}
            >
              {emailAction === dictionary.get('rispondi') ? dictionary.get('rispondiMail') : dictionary.get('inoltraMail')}
            </LoadingButton>
          </Stack>
      {/* TODO: dialog di conferma prima di uscire in caso di dati inseriti */}
      {/* <ConfirmDialog                  
        message={dictionary.get('messaggioDialogDatiNonSalvati')}
        cancelString={dictionary.get('continuaModificare')}
        confirmString={dictionary.get('procediSenzaSalvare')}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        sx={{ maxWidth: '500px' }} /> */}
        </Grid>
      </Grid>
    );
}