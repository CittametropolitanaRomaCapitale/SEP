import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { dictionary } from '../dictionary';

export type GestioneAnnullamentoForm = {
  motivazione:string
}

export const useGestisciAnnullamentoForm = () => {

  const methods = useForm<GestioneAnnullamentoForm>({
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<GestioneAnnullamentoForm> [] = [
      {
        type: 'text',
        name: 'motivazione',
        required: true,
        label: dictionary.get('motivazione'),
        componentProps: {
          multiline: true,
          minRows: 3,
          maxRows: 3
        },
        sx: { width: { xs: 1, sm: 1 / 1 } }
      }
    ];

  return { methods, structure };
};
