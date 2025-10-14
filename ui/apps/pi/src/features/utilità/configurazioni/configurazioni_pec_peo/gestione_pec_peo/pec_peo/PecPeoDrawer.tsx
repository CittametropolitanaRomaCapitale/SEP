import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import toast from '@cmrc/ui/components/Toast';
import LoadingButton from '@mui/lab/LoadingButton';
import { PecPeo, PecPeoDtoInputInput, Ufficio } from '@cmrc/services/src/app/piapi/generated';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useDrawer } from '../../../../../../store/drawer/useDrawer';
import { usePecPeoForm, UserDataInput } from './usePecPeoForm';
import { dictionary } from './dictionary';
import { useGetQueryPecPeoList } from '../useDataPecPeo';
import { useGestionPecPeo } from '../useGestionPecPeo';

export interface PostaProps {
  data?: PecPeo;
}

export const PecPeoDrawer: FCC<PostaProps> = ({ data }) => {
  const { closeDrawer } = useDrawer({
    drawer_id: 'pecPeoDrawer'
  });
  const { methods, structure } = usePecPeoForm({ initialData: data });
  const { savePecPeoConfig, updatePecPeoConfig, isLoadingSave } = useGestionPecPeo();
  const { refetch } = useGetQueryPecPeoList();

  const onSave = async ({ ...values }) => {
    const userValue = values?.utenteForm?.value;
    let userData: UserDataInput;
    if (userValue) {
      userData = {
        authId: userValue?.authId,
        username: userValue?.username,
        fullName: userValue?.fullName
      }
    }

    const cdrList: Ufficio[] = values?.ufficiForm.map((office) => ({
      cdr: office.label,
      cdrCode: office.value,
    })) || [];

    const switchValue = userData?.authId ? 'utente' : 'cdr'
    const input: PecPeoDtoInputInput = {
      tipologiaPosta: values?.tipologiaPosta,
      cdrList,
      idUtente: userData?.authId,
      utente: userData?.fullName,
      username: userData?.username,
      indirizzoEmail: values?.indirizzoEmail,
      password: values?.password,
      formSwitch: switchValue,
      attiva: true,
      saveToSent: values?.saveToSent ?? false,
      readPec: values?.readPec ?? false,
      deleteMessages: values?.deleteMessages ?? false,
      sendRispostaAutomatica: values?.mustSendRispostaAutomatica ?? false
    };

    if (data?.id) {
      const response = await updatePecPeoConfig({
        id: data?.id,
        input
      })

      if (response?.updateConfigurations) {
        closeDrawer();
        toast.success(dictionary.get('updateSuccess'))
      }

    } else {
      const response = await savePecPeoConfig(input);

      if (response?.saveConfiguration) {
        closeDrawer();
        const successMsg = cdrList.length > 1 ? dictionary.get('saveSuccessPlural') : dictionary.get('saveSuccess')
        toast.success(successMsg)
      }
    }
    refetch();
  }

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1, sm: 480 }, padding: 3 }}
    >
      <Grid item>
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid item>
        <Grid sx={{ display: 'flex', justifyContent: 'right' }}>
          <Button
            onClick={closeDrawer}
            size="small"
            sx={{ height: '30px', mr: 1 }}
          >
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            onClick={methods.handleSubmit((values) => onSave(values))}
            size="small"
            variant="contained"
            loading={isLoadingSave}
            sx={{ height: '30px' }}
          >
            {dictionary.get('salva')}
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
