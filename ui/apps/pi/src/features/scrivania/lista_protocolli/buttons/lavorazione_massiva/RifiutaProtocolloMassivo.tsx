import { FCC } from "@cmrc/types/FCC";
import { useState } from "react";
import toast from "@cmrc/ui/components/Toast";
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator";
import { ProtocolloBaseFragment, useRifiutaProtocolloMassivaMutation } from "@cmrc/services/src/app/piapi/generated";
import { useOffice } from "@cmrc/auth/useOffice";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useDialog } from "../../../../../store/dialog/useDialog";
import { RifiutaProtocolloForm, useRifutaProtocolloForm } from "../../../../protocollo/protocollo_actions/rifiuta_protocollo/hooks/useRifutaProtocolloForm";
import { useGetQueryProtocolliList } from "../../hooks/useDataProtocolliList";
import { dictionary } from "./dictionary";

export interface RifiutaProtocolloMassivoProps {
  protocolliList: ProtocolloBaseFragment[];
}

export const RifiutaProtocolloMassivo: FCC<RifiutaProtocolloMassivoProps> = ({ protocolliList }) => {
  const { cdrCode } = useOffice();
  const [loading, setLoading] = useState(false);
  const { methods, structure } = useRifutaProtocolloForm();
  const { refetch } = useGetQueryProtocolliList();

  const [rifiutoMassivo] = useRifiutaProtocolloMassivaMutation();

  const { close: closeDialog } = useDialog({
    dialog_id: 'dialogRifiutaMassivo'
  });

  const onConfirm = async ({ motivazione }: RifiutaProtocolloForm) => {
    setLoading(true);
    try {
      const response = await rifiutoMassivo({
        numbers: protocolliList.map(protocollo => protocollo.nProtocollo),
        selectedOffice: cdrCode,
        note: motivazione
      }).unwrap();

      if (response?.rifiutaProtocolloMassiva) {
        toast.success(dictionary.get("rifiutoMassivoOk"));
        refetch();
        closeDialog();
      }

    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  }

  return (
    <Grid
      container
      direction="column"
      rowSpacing={3}
      sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 5 }}
    >
      <Grid item>
        <Typography sx={{ pb: 1 }}>{dictionary.get('notaRifiuto')}</Typography>
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
            loading={loading}
          >
            {dictionary.get('conferma')}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  )
}