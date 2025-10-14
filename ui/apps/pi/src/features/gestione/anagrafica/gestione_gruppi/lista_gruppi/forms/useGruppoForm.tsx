import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { GruppoAnagraficaDtoInput } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from './dictionary';

export const useGruppoForm = (
  props: { initialData: GruppoAnagraficaDtoInput } = null
) => {

  const initialData: GruppoAnagraficaDtoInput = {
    nome: props?.initialData?.nome,
    note: props?.initialData?.note,
  }

  const methods = useForm<GruppoAnagraficaDtoInput>({
    defaultValues: initialData,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<GruppoAnagraficaDtoInput>[] = [
    {
      type: 'text',
      name: 'nome',
      required: true,
      label: dictionary.get('nome'),
      sx: { width: { xs: 1, sm: 1 / 1 } }
    },
    {
      type: 'textarea',
      name: 'note',
      label: dictionary.get('note'),
      componentProps: {
        multiline: true,
        minRows: 2
      },
      sx: { width: { xs: 1, sm: 1 / 1 } },
    },
  ];

  return { methods, structure };
};