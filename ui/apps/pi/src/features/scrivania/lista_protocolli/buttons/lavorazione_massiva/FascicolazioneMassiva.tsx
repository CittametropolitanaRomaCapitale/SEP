import { FCC } from "@cmrc/types/FCC";
import toast from "@cmrc/ui/components/Toast";
import { Button, Grid, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator";
import { ProtocolloBaseFragment, useFascicolaProtocolloMassivoMutation, } from "@cmrc/services/src/app/piapi/generated";
import { useOffice } from "@cmrc/auth/useOffice";
import { useGetQueryProtocolliList } from "../../hooks/useDataProtocolliList";
import { useClassificaProtocolloForm } from "../../../../protocollo/protocollo_actions/classifica_protocollo/hooks/useClassificaProtocolloForm";
import { useDialog } from "../../../../../store/dialog/useDialog";
import { dictionary } from "./dictionary";

export interface FascicolazioneMassivaProps {
  protocolliList: ProtocolloBaseFragment[];
}

export const FascicolazioneMassiva: FCC<FascicolazioneMassivaProps> = ({protocolliList}) => {
  const { cdrCode: selectedOffice } = useOffice();
  const { refetch } = useGetQueryProtocolliList();
  const { methods, structure } = useClassificaProtocolloForm();
  const [fascicolazioneMassivaProtocollo, { isLoading }] = useFascicolaProtocolloMassivoMutation();
  const { close: closeDialog } = useDialog({
    dialog_id: `dialogClassificaProtocollo`
  });

  const handleCloseDialog = () => {
    closeDialog();
  }

  const onConfirm = async ({ ...values }: any) => {
    const response = await fascicolazioneMassivaProtocollo({
      idProtocolloList: protocolliList?.map(item => item.id),
      idTitolarioList: values.idTitolario.map(item => item.id),
      selectedOffice
    }).unwrap();

    if (response?.fascicolazioneMassivaProtocollo) {
      toast.success(dictionary.get('fascicolazioneMassivaOK'));
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