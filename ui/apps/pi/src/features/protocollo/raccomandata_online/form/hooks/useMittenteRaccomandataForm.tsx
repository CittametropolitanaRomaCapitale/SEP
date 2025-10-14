import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { isNumeric, isString } from '@cmrc/ui/utils/validator-utils';
import { RaccomandataProtocolloInputInput } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../../dictionary';
import { useGetMittente } from './useGetMittente';
import { useEffect } from 'react';
import { useOffice } from '@cmrc/auth/useOffice';

export const useMittenteRaccomandataForm = (formMethod, readMode) => {
  const { data } = useGetMittente();
  const { cdr } = useOffice();
  useEffect(() => {
    if (readMode)
      return;
    if (data?.getMittenteFileds) {
      formMethod.setValue('ulterioreDatoMittente', cdr);
      formMethod.setValue(
        'mittenteIndirizzo',
        data?.getMittenteFileds?.indirizzo
      );
      formMethod.setValue('mittenteCivico', data?.getMittenteFileds?.civico);
      formMethod.setValue('mittentePresso', data?.getMittenteFileds?.presso);
      formMethod.setValue('mittenteCitta', data?.getMittenteFileds?.citta);
      formMethod.setValue('mittenteCap', data?.getMittenteFileds?.cap);
      formMethod.setValue(
        'mittenteProvincia',
        data?.getMittenteFileds?.provincia
      );
    }
  }, [data]);

  const structure: BaseInputProps<RaccomandataProtocolloInputInput>[] = [
    {
      type: 'text',
      name: 'mittente',
      required: true,
      label: dictionary.get('mittente'),
      disabled: true,
      placeholder: dictionary.get('mittente'),
      sx: { width: { xs: 1, sm: 3 / 4 } },
      value: 'Città Metr Roma Capitale',
      componentProps: {
        maxLength: 25,
        inputRightElement: (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#888',
              marginLeft: '8px'
            }}
          >
            {formMethod.watch('mittente')?.length ?? 0}/25
          </span>
        )
      },
      validation: {
        validate: (value: string) => {
          if (value && value?.length < 3) {
            return dictionary.get('invalidDenominazione');
          }
          return true;
        }
      }
    },
    {
      type: 'text',
      name: 'ulterioreDatoMittente',
      label: dictionary.get('ulterioreDatoMittente'),
      sx: { width: { xs: 1, sm: 3 / 4 } },
      componentProps: {
        maxLength: 19,
        inputRightElement: (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#888',
              marginLeft: '8px'
            }}
          >
            {formMethod.watch('ulterioreDatoMittente')?.length ?? 0}/19
          </span>
        )
      }
    },
    {
      type: 'address',
      name: 'mittenteIndirizzo',
      label: dictionary.get('indirizzoMittente'),
      required: true,
      sx: { width: { xs: 1, sm: 3 / 4 } },
      componentProps: {
        maxLength: 44,
        inputRightElement: (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#888',
              marginLeft: '8px'
            }}
          >
            {formMethod.watch('mittenteIndirizzo')?.length ?? 0}/44
          </span>
        )
      }
    },
    {
      type: 'address',
      name: 'mittenteCivico',
      label: dictionary.get('civicoMittente'),
      required: true,
      componentProps: {
        maxLength: 10,
        inputRightElement: (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#888',
              marginLeft: '8px'
            }}
          >
            {formMethod.watch('mittenteCivico')?.length ?? 0}/10
          </span>
        )
      },
      sx: { width: { xs: 1, sm: 1 / 4 } }
    },
    {
      type: 'address',
      name: 'mittentePresso',
      label: dictionary.get('indirizzo2Mittente'),
      sx: { width: { xs: 1, sm: 3 / 4 } },
      componentProps: {
        maxLength: 44,
        inputRightElement: (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#888',
              marginLeft: '8px'
            }}
          >
            {formMethod.watch('mittentePresso')?.length ?? 0}/44
          </span>
        )
      }
    },
    {
      type: 'text',
      name: 'mittenteCitta',
      label: dictionary.get('cittaMittente'),
      required: true,
      sx: { width: { xs: 1, sm: 6.5 / 12 } },
      componentProps: {
        maxLength: 36,
        inputRightElement: (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#888',
              marginLeft: '8px'
            }}
          >
            {formMethod.watch('mittenteCitta')?.length ?? 0}/36
          </span>
        )
      }
    },
    {
      type: 'text',
      name: 'mittenteCap',
      label: dictionary.get('capMittente'),
      required: true,
      componentProps: {
        maxLength: 5,
        inputRightElement: (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#888',
              marginLeft: '8px'
            }}
          >
            {formMethod.watch('mittenteCap')?.length ?? 0}/5
          </span>
        )
      },
      validation: {
        validate: (value: string) => {
          if (value && (!isNumeric(value) || value?.length < 5)) {
            return dictionary.get('invalidCap');
          }
          return true;
        }
      },
      sx: { width: { xs: 1, sm: 2.5 / 12 } }
    },
    {
      type: 'text',
      name: 'mittenteProvincia',
      required: true,
      label: dictionary.get('provinciaMittente'),
      componentProps: {
        maxLength: 2,
        onInput: (e) => {
          const { value } = e.target;
          e.target.value = value.toUpperCase();
        },
        inputRightElement: (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#888',
              marginLeft: '8px'
            }}
          >
            {formMethod.watch('mittenteProvincia')?.length ?? 0}/2
          </span>
        )
      },
      validation: {
        validate: (value: string) => {
          if (value && !isString(value)) {
            return dictionary.get('invalidProvincia');
          }
          return true;
        }
      },
      sx: { width: { xs: 1, sm: 3 / 12 } }
    }
  ];

  return { structure };
};
