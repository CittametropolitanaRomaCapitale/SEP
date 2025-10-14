import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { dictionary } from '../../dictionary';

export type AnnullaRaccomandataForm = {
  motivazione:string
}

export const useAnnullaRaccomandataForm = () => {

  const methods = useForm<AnnullaRaccomandataForm>({
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<AnnullaRaccomandataForm> [] = [
      {
        type: 'text',
        name: 'motivazione',
        label: dictionary.get('motivazioneAnnullamento'),
        required: true,
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
