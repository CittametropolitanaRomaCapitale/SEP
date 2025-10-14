import { FCC } from "@cmrc/types/FCC"
import LoadingButton from "@mui/lab/LoadingButton"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import toast from "@cmrc/ui/components/Toast"
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator"
import { useInsertVisibilitaTitolarioMutation, VisibilitaTitolarioInputInput } from "@cmrc/services/src/app/piapi/generated"
import { useDrawer } from "../../../../../../../store/drawer/useDrawer"
import { AggiungiPermessi, useAggiungiPermessiForm } from "./hooks/useAggiungiPermessiForm"
import { useGetQueryDettaglioTitolario } from "../../../hooks/useDataDettaglioFascicolo"
import { useGetQueryPermessiFascicolo } from "../../../hooks/useDataPermessiFascicolo"
import { dictionary } from "../dictionary"

export const AggiungiPermessiForm: FCC = () => {
  const [insertVisibilitaTitolario, { isLoading }] = useInsertVisibilitaTitolarioMutation();
  const { data } = useGetQueryDettaglioTitolario();
  const { refetch } = useGetQueryPermessiFascicolo();

  const { methods, structure } = useAggiungiPermessiForm();
  const { closeDrawer } = useDrawer({
    drawer_id: 'titolarioPermessiDrawer'
  });

  const onConfirm = async ({ ...values }: AggiungiPermessi) => {
    const utenteAuthIdList = Array.isArray(values?.utenti)
    ? values.utenti.map((utente: any) => utente.value) : [];

    const input: VisibilitaTitolarioInputInput = {
      idTitolario: data?.dettaglioTitolario?.id,
      utenteAuthIdList,
      note: values?.note,
      permesso: values?.permesso,
      cdr: `${values?.cdr.value.name} - ${values?.cdr.value.description}`,
      cdrCode: values?.cdr.value.code,
    }

    const response = await insertVisibilitaTitolario({
      visibilitaTitolarioInput: input
    }).unwrap();

    try {
      if (response?.insertVisibilitatitolario) {
        toast.success(dictionary.get('insertSuccess'));
        refetch();
        closeDrawer();
      }
    } catch (error) {
      toast.error(error.message);
    }
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
            onClick={methods.handleSubmit((values) => onConfirm(values))}
            size="small"
            variant="contained"
            loading={isLoading}
            sx={{ height: '30px' }}
          >
            {dictionary.get('conferma')}
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
}