import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { dictionary } from '../../dictionary';
import { DettaglioProtocolloDto } from '@cmrc/services/src/app/piapi/generated';
import { useGetQueryDettaglioProtocollo } from '../../../useDataDettaglioProtocollo';
import { useForm } from 'react-hook-form';
import { Button, Grid } from '@mui/material';
export const useSelezionaDestinatarioForm = (
  onConfirmClick: (idDestinatario: number) => void,
  readMode?: boolean
) => {
  const { data } = useGetQueryDettaglioProtocollo();
  const competenza = data?.dettaglioProtocollo?.destinatariCompetenza || [];
  const conoscenza = data?.dettaglioProtocollo?.destinatariConoscenza || [];

  const methods = useForm<any>({
    defaultValues: {},
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<DettaglioProtocolloDto>[] = [
    {
      type: 'select',
      name: 'selectDestinatario',
      label: dictionary.get('selectDestinatario'),
      options: [...competenza, ...conoscenza].map((dest) => ({
        label: dest?.label,
        value: dest?.idDestinatario
      })),
      onChange: (value) => {
        if (value) {
          methods.setValue('selectDestinatario', value);
        }
      }
    },
    {
      type: 'custom',
      name: 'confirmButton',
      render: () => (
        <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => {
              const selectedId = methods.getValues('selectDestinatario');
              if (selectedId) {
                onConfirmClick(Number(selectedId));
              }
            }}
            disabled={readMode}
            size="small"
            variant="outlined"
            sx={{ height: '30px', width: '130px' }}
          >
            {dictionary.get('compilaForm')}
          </Button>
        </Grid>
      )
    }
  ];
  return { structure, methods };
};
