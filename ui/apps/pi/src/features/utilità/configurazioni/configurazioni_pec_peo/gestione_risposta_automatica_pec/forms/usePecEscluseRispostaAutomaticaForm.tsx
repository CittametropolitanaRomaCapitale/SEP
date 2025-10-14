import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import {
  PecEscluseRispostaAutomatica,
  PecEscluseRispostaAutomaticaInputInput
} from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';

export const usePecEscluseRispostaAutomaticaForm = (
  props: { initialData: PecEscluseRispostaAutomatica } = null
) => {
  const initialData = {
    indirizzo: props?.initialData?.indirizzo
  };

  const methods = useForm<PecEscluseRispostaAutomaticaInputInput>({
    defaultValues: initialData,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<PecEscluseRispostaAutomaticaInputInput>[] = [
    {
      type: 'text',
      name: 'indirizzo',
      required: true,
      label: dictionary.get('indirizzo'),
      sx: { width: { xs: 1, sm: 1 } }
    }
  ];

  return { methods, structure };
};
