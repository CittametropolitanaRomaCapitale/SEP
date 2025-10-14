import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { dictionary } from '../dictionary';

export type AnnullaProtocolloForm = {
  motivazione:string
}

export const useAnnullaProtocolloForm = () => {

  const methods = useForm<AnnullaProtocolloForm>({
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<AnnullaProtocolloForm> [] = [
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
