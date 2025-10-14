import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { isNumeric, isString } from '@cmrc/ui/utils/validator-utils';
import { RaccomandataProtocolloInputInput } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../../dictionary';
import { useGetDettaglioAnagrafica } from './useGetDettaglioAnagrafica';
import {
  useLazyListaCapQuery,
  useLazyListaCapEstesoQuery,
  useLazyVieDaCapQuery
} from '@cmrc/services/src/app/piapi/generated';
import { useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

export const useDestinatarioRaccomandataForm = ({
  formMethod,
  confirmedDestinatario,
  readMode
}) => {
  const { data } = useGetDettaglioAnagrafica(confirmedDestinatario);
  const [getListaCap] = useLazyListaCapQuery();
  const [getListaCapEsteso] = useLazyListaCapEstesoQuery();
  const [vieDaCap] = useLazyVieDaCapQuery();

  const debouncedGetListaCap = useCallback(
    debounce((value, callback) => {
      getListaCap({ prefix: value }).then(callback);
    }, 500),
    []
  );

  const debouncedGetVieDaCap = useCallback(
    debounce((value, prefix, callback) => {
      vieDaCap({ cap: value, prefix: prefix }).then(callback);
    }, 500),
    []
  );

  const debouncedGetListaCapEsteso = useCallback(
    debounce((value, callback) => {
      const cap = formMethod.getValues('destinatarioCap');
      getListaCapEsteso({
        prefix: typeof cap === 'string' ? cap : cap?.value || '',
        citta: value,
        tipoRicerca: 'ctPrefix'
      }).then(callback);
    }, 500),
    []
  );

  const debouncedSetValueIndirizzo = useCallback(
    debounce((field, value) => {
      formMethod.setValue(field, value, { shouldValidate: true });
    }, 500),
    []
  );

  useEffect(() => {
    if (readMode)
      return;

    formMethod.setValue(
      'destinatario',
      data?.getDettaglioAnagrafica?.ragioneSociale || ''
    );
    formMethod.setValue(
      'destinatarioIndirizzo',
      {label: data?.getDettaglioAnagrafica?.indirizzo || '', value:data?.getDettaglioAnagrafica?.indirizzo || ''}
    );
    formMethod.setValue(
      'destinatarioCitta',
      {label: data?.getDettaglioAnagrafica?.citta || '', value:data?.getDettaglioAnagrafica?.citta || ''}
    );
    formMethod.setValue(
      'destinatarioCap',
      {label: data?.getDettaglioAnagrafica?.cap || '', value:data?.getDettaglioAnagrafica?.cap || ''}
    );
    formMethod.setValue(
      'destinatarioProvincia',
      data?.getDettaglioAnagrafica?.provincia || ''
    );
  }, [data]);

  const structure: BaseInputProps<RaccomandataProtocolloInputInput>[] = [
    {
      type: 'text',
      name: 'destinatario',
      required: true,
      label: dictionary.get('destinatario'),
      placeholder: dictionary.get('destinatario'),
      sx: { width: { xs: 1, sm: 4 / 4 } },
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
            {formMethod.watch('destinatario')?.length ?? 0}/44
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
    readMode ? {
      type: 'text',
      name: 'destinatarioCitta',
      label: dictionary.get('cittaDestinatario'),
      required: true,
      sx: { width: { xs: 1, sm: 2 / 4 } }
    } : {
      type: 'select-autocomplete',
      name: 'destinatarioCitta',
      label: dictionary.get('cittaDestinatario'),
      required: true,
      query: (value) => {
        if (value?.length >= 3) {
          return new Promise((resolve) => {
            debouncedGetListaCapEsteso(value, resolve);
          });
        }
      },
      optionMapping: ({ data }) =>
        Array.from(
          new Map(data?.listaCapEsteso?.map((item) => [item[1], item])).values()
        ).map((capEsteso) => ({
          label: capEsteso[1],
          value: capEsteso
        })),
      onSelect: (capEstesoSelected, setValue) => {
        if (capEstesoSelected) {
          formMethod.setValue('destinatarioCap', {'label': capEstesoSelected?.value[0], 'value': capEstesoSelected?.value[0]}, {shouldValidate: true});
          formMethod.setValue('destinatarioProvincia', capEstesoSelected?.value[2]);
        }
      },
      sx: { width: { xs: 1, sm: 2 / 4 } }
    },
    {
      type: 'text',
      name: 'destinatarioProvincia',
      required: true,
      label: dictionary.get('provinciaDestinatario'),
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
            {formMethod.watch('destinatarioProvincia')?.length ?? 0}/2
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
      sx: { width: { xs: 1, sm: 1 / 4 } }
    },
    readMode ? {
      type: 'text',
      name: 'destinatarioCap',
      label: dictionary.get('capDestinatario'),
      required: true,
      sx: { width: { xs: 1, sm: 1 / 4 } }
    } : {
      type: 'select-autocomplete',
      name: 'destinatarioCap',
      label: dictionary.get('capDestinatario'),
      required: true,
      query: (value) => {
        if (value?.length >= 3) {
          return new Promise((resolve) => {
            debouncedGetListaCap(value, resolve);
          });
        }
      },
      optionMapping: ({ data }) =>
        data?.listaCap?.map((cap) => ({
          label: cap,
          value: cap
        })),
      onSelect: (value, setValue) => {
        setValue('destinatarioCap', value);
      },
      validation: {
        validate: (value: any) => {
          const cap = typeof value === 'string' ? value : value?.value;
          if (!cap || !isNumeric(cap) || cap.length !== 5) {
            return dictionary.get('invalidCap');
          }
          return true;
        }
      },
      sx: { width: { xs: 1, sm: 1 / 4 } }
    },
    readMode ? {
      type: 'address',
      name: 'destinatarioIndirizzo',
      label: dictionary.get('indirizzoDestinatario'),
      required: true,
      sx: { width: { xs: 1, sm: 3 / 6 } }
    } : {
      type: 'select-autocomplete',
      name: 'destinatarioIndirizzo',
      label: dictionary.get('indirizzoDestinatario'),
      required: true,
      query: (value) => {
        if (value?.length >= 5 && formMethod.getValues('destinatarioCap')) {
          const cap = formMethod.getValues('destinatarioCap');
          console.log("cap", cap);
          if (cap !== null && cap.value && cap.value.length === 5) {
            return new Promise((resolve) => {
              debouncedGetVieDaCap(cap?.value, value, resolve);
            });
          }
        }
      },
      optionMapping: ({ data }) =>
        data?.vieDaCap?.map((via) => ({
          label: via,
          value: via
        })),
      onSelect: (value, setValue) => {
        setValue('destinatarioIndirizzo', value, { shouldValidate: true });
      },
      componentProps: {
        freeSolo: true,
        onInput: (e) => {
          const value = e.target.value;
          debouncedSetValueIndirizzo('destinatarioIndirizzo', value);
        }
      },
      sx: { width: { xs: 1, sm: 3 / 6 } }
    },
    {
      type: 'address',
      name: 'destinatarioIndirizzo2',
      label: dictionary.get('indirizzo2Destinatario'),
      sx: { width: { xs: 1, sm: 2 / 6 } },
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
            {formMethod.watch('destinatarioIndirizzo2')?.length ?? 0}/44
          </span>
        )
      }
    },
    {
      type: 'address',
      name: 'destinatarioCivico',
      label: dictionary.get('civicoDestinatario'),
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
            {formMethod.watch('destinatarioCivico')?.length ?? 0}/10
          </span>
        )
      },
      sx: { width: { xs: 1, sm: 1 / 6 } }
    }
  ];

  return { structure };
};
