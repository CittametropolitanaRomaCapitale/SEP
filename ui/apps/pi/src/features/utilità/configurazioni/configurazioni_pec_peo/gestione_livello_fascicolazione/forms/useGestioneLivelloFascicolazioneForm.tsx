import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { dictionary } from '../dictionary';
import { useEffect } from 'react';

export type GestioneLivelloFascicolazioneFormProps = {
  livello: number;
};

export const useGestioneLivelloFascicolazioneForm = ({
  initialData
}: {
  initialData: number;
}) => {
  const methods = useForm<GestioneLivelloFascicolazioneFormProps>({
    defaultValues: { livello: initialData },
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    if (initialData !== undefined) {
      methods.reset({ livello: initialData });
    }
  }, [initialData, methods]);

  const structure: BaseInputProps<GestioneLivelloFascicolazioneFormProps>[] = [
    {
      type: 'text',
      name: 'livello',
      label: dictionary.get('livello'),
      required: true,
      sx: { width: { xs: 1, sm: 1 / 3 } }
    }
  ];

  return { methods, structure };
};
