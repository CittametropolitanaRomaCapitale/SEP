import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { RicercaProtocolliDtoInput } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';

export const useFormSearchProtocolli = (
  props: { initialData?: RicercaProtocolliDtoInput } = null
) => {

  const methods = useForm<RicercaProtocolliDtoInput>({
    defaultValues: props?.initialData,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<RicercaProtocolliDtoInput>[] = [
    {
      type: 'hidden',
      disabled: true,
      name: 'filtro',
      value: props?.initialData?.filtroUfficio ? 'IL_MIO_UFFICIO' : '',
      label: dictionary.get('sezione'),
      sx: { display:'none', width: 0 }
    },
    {
      type: 'text',
      name: 'numero',
      value: props?.initialData?.numero,
      label: dictionary.get('numero'),
      sx: { width: { xs: 1, sm: 1 / 5 } }
    },
    {
      type: 'text',
      name: 'anno',
      value: props?.initialData?.anno,
      label: dictionary.get('anno'),
      sx: { width: { xs: 1, sm: 1 / 5 } }
    },
    {
      type: 'text',
      name: 'oggetto',
      value: props?.initialData?.oggetto,
      label: dictionary.get('oggetto'),
      sx: { width: { xs: 1, sm: 1 / 5 } }
    }
  ];

  return { methods, structure };
};
