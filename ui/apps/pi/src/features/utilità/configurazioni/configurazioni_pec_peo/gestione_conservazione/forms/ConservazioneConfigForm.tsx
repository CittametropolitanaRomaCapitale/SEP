import { FCC } from "@cmrc/types/FCC";
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import toast from "@cmrc/ui/components/Toast";
import { LoginConservazioneDto, useSaveLoginConservazioneMutation, useUpdateLoginConservazioneMutation } from "@cmrc/services/src/app/piapi/generated";
import { dictionary } from "../dictionary";
import { useConservazioneConfigForm } from "../hooks/useConservazioneConfigForm";
import { useGetQueryConservazioneConfig } from "../hooks/useDataConservazioneConfig";

export type ConservazioneConfigFormProps = {
  initialData: LoginConservazioneDto;
}

export const ConservazioneConfigForm: FCC<ConservazioneConfigFormProps> = ({ initialData }) => {
  const { methods, structure } = useConservazioneConfigForm({ initialData });
  const [updateMutation, { isLoading: isLoadingUpdate }] = useUpdateLoginConservazioneMutation();
  const [saveMutation, { isLoading: isLoadingSave }] = useSaveLoginConservazioneMutation();
  const { refetch } = useGetQueryConservazioneConfig()

  const onConfirm = async ({ ...values }) => {

    const inputDto: LoginConservazioneDto = {
      ...values
    }

    const configMissing = Object.values(initialData).every(value => value === null)

    if (configMissing) {
      const responseSave = await saveMutation({
        loginInput: inputDto
      }).unwrap()

      if (responseSave?.saveLoginConservazione) {
        toast.success(dictionary.get('saveSuccess'))
        refetch()
      }

    } else {
      const responseUpdate = await updateMutation({
        loginInput: inputDto
      }).unwrap()

      if (responseUpdate?.updateLoginConservazione) {
        toast.success(dictionary.get('updateSuccess'))
      }
    }
  }

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ padding: 3 }}
    >
      <Grid item>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid item>
        <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
          <LoadingButton
            onClick={methods.handleSubmit((values) => onConfirm(values))}
            size="small"
            variant="contained"
            loading={isLoadingSave || isLoadingUpdate}
            sx={{ height: '30px' }}
          >
            {dictionary.get('save')}
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
}