import { FCC } from '@cmrc/types/FCC';
import { useState } from 'react';
import {
  ProtocolloBaseFragment,
  ReferenteOutputDto,
  ReferenteProtocolloInputInput,
  useAssegnazioneProtocolloMassivaMutation
} from '@cmrc/services/src/app/piapi/generated';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormGenerator } from '@cmrc/ui/form/FormGenerator/core/FormGenerator';
import { useOffice } from '@cmrc/auth/useOffice';
import toast from '@cmrc/ui/components/Toast';
import { useGetQueryProtocolliList } from '../../hooks/useDataProtocolliList';
import { useDialog } from '../../../../../store/dialog/useDialog';
import { useAssegnaProtocolloMassivoForm } from './hooks/useAssegnaProtocolloMassivoForm';
import { dictionary } from './dictionary';

export interface AssegnaProtocolloMassivoProps {
  protocolliList: ProtocolloBaseFragment[];
}

export const AssegnaProtocolloMassivo: FCC<AssegnaProtocolloMassivoProps> = ({
  protocolliList
}) => {
  const { cdrCode } = useOffice();
  const [loading, setLoading] = useState(false);
  const { methods, structure } = useAssegnaProtocolloMassivoForm();
  const { refetch: listaRefetch } = useGetQueryProtocolliList();
  const [assegnazioneMassiva] = useAssegnazioneProtocolloMassivaMutation();
  const { close: closeDialog } = useDialog({
    dialog_id: 'dialogAssegnaMassivo'
  });

  const onSave = async ({ ...values }: any) => {
    setLoading(true);
    const referenti: ReferenteProtocolloInputInput[] = values?.assegnatari?.map(
      (item: ReferenteOutputDto) => ({
        idAssegnatario: item?.idDestinatario,
        nomeAssegnatario: item?.label,
        tipoDestinatario: item?.tipo
      })
    );

    try {
      const response = await assegnazioneMassiva({
        numbers: protocolliList.map((protocollo) => protocollo.nProtocollo),
        selectedOffice: cdrCode,
        referenti,
        noteAssegnazione: values?.noteAssegnazione
      }).unwrap();

      if (response?.assegnazioneProtocolloMassiva) {
        toast.success(dictionary.get('assegnazioneMassivaOk'));
        listaRefetch();
        closeDialog();
      }
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };

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
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          justifyContent="flex-end"
        >
          <Button onClick={closeDialog} size="small" variant="outlined">
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton
            onClick={methods.handleSubmit((values) => onSave(values))}
            size="small"
            variant="contained"
            loading={loading}
          >
            {dictionary.get('assegna')}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};
