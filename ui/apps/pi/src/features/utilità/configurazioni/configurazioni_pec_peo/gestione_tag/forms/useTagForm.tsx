import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { Tag, TagInputInput } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';

export const useTagForm = (props: { initialData: Tag } = null) => {
  const initialData = {
    nome: props?.initialData?.nome
  };

  const methods = useForm<TagInputInput>({
    defaultValues: initialData,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<TagInputInput>[] = [
    {
      type: 'text',
      name: 'nome',
      required: true,
      label: dictionary.get('nome'),
      sx: { width: { xs: 1, sm: 1 } }
    }
  ];

  return { methods, structure };
};
