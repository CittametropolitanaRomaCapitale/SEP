import { FCC } from "@cmrc/types/FCC";
import toast from "@cmrc/ui/components/Toast";
import { Button, Grid, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator";
import { ProtocolloBaseFragment, useFascicolaProtocolloMutation, } from "@cmrc/services/src/app/piapi/generated";
import { useOffice } from "@cmrc/auth/useOffice";
import { useDialog } from "../../../../store/dialog/useDialog";
import { useGetQueryProtocolliList } from "../../../scrivania/lista_protocolli/hooks/useDataProtocolliList";
import { dictionary } from "./dictionary";
import { useClassificaProtocolloForm } from "./hooks/useClassificaProtocolloForm";

export interface ClassificaProtocolloProps {
  protocolloData: ProtocolloBaseFragment;
}

export const ClassificaProtocollo: FCC<ClassificaProtocolloProps> = ({protocolloData}) => {
  const { cdrCode: selectedOffice } = useOffice();
  const { refetch } = useGetQueryProtocolliList();
  const { methods, structure } = useClassificaProtocolloForm();
  const [fascicolazioneProtocollo, { isLoading }] = useFascicolaProtocolloMutation();
  const { close: closeDialog } = useDialog({
    dialog_id: `dialogClassificaProtocollo${protocolloData?.id}`
  });

  const handleCloseDialog = () => {
    closeDialog();
  }

  const onConfirm = async ({ ...values }: any) => {
    const response = await fascicolazioneProtocollo({
      idProtocollo: protocolloData?.id,
      idTitolarioList: values.idTitolario.map(item => item.id),
      selectedOffice
    }).unwrap();

    if (response?.fascicolazioneProtocollo) {
      toast.success(dictionary.get('fascicolazioneOK'));
      refetch();
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
        <FormGenerator methods={methods} structure={structure} />
      </Grid>
      <Grid item>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end"  >
          <Button
            onClick={handleCloseDialog}
            size="small"
            variant="outlined"
          >
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            onClick={methods.handleSubmit((values) => onConfirm(values))}
            size="small"
            variant="contained"
            loading={isLoading}
          >
            {dictionary.get('conferma')}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
}