import { FCC } from "@cmrc/types/FCC";
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import toast from "@cmrc/ui/components/Toast";
import { LoginRaccomandataDto, LoginRaccomandataDtoInput, useSaveLoginRaccomandataMutation, useUpdateLoginRaccomandataMutation } from "@cmrc/services/src/app/piapi/generated";
import { useRaccomandataWebConfigForm } from "./hooks/useRaccomandataWebConfigForm";
import { dictionary } from "./dictionary";
import { useGetQueryRaccomandataConfig } from "./hooks/useDataConfigRaccomandata";

export type RaccomandataWebConfigFormProps = {
  initialData: LoginRaccomandataDtoInput;
}

export const RaccomandataWebConfigForm: FCC<RaccomandataWebConfigFormProps> = ({initialData}) => {  
  const {methods, structure} = useRaccomandataWebConfigForm({initialData});
  const [updateMutation, {isLoading : isLoadingUpdate}] = useUpdateLoginRaccomandataMutation();
  const [saveMutation, {isLoading : isLoadingSave}] = useSaveLoginRaccomandataMutation();
  const { refetch } = useGetQueryRaccomandataConfig()

  const onConfirm = async ({ ...values }) => {

    const inputDto:LoginRaccomandataDto = {
      ...values
    }

    const configMissing = Object.values(initialData).every(value => value === null)

    if(configMissing) {
      const responseSave = await saveMutation({
        loginInput: inputDto
      }).unwrap()
      
      if(responseSave?.saveLoginRaccomandata) {
        toast.success(dictionary.get('saveSuccess'))
        refetch();
      }

    }else{
      const responseUpdate = await updateMutation({
        loginInput: inputDto
      }).unwrap()
      
      if(responseUpdate?.updateLoginRaccomandata) {
        toast.success(dictionary.get('updateSuccess'))
      }
    }
  }




  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{padding: 3 }}
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