import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { ReferenteProtocolloInputInput } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';

export const useNoteForm = (protocolloData) => {
  const methods = useForm<any>({
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<ReferenteProtocolloInputInput>[] = [
    {
      type: 'text',
      name: 'note',
      label: dictionary.get('note'),
      value: protocolloData?.note,
      required: false,
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
