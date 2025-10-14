import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { dictionary } from '../dictionary';

export type RichiediAssegnazioneProtocolloForm = {
  motivazione:string
}

export const useRichiediAssegnazioneProtocolloForm = () => {

  const methods = useForm<RichiediAssegnazioneProtocolloForm>({
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<RichiediAssegnazioneProtocolloForm> [] = [
      {
        type: 'text',
        name: 'motivazione',
        label: dictionary.get('motivazione'),
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
