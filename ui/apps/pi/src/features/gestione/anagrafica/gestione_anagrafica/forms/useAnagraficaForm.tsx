import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import {
  AnagraficaDto,
  AnagraficaInputInput,
  Gruppo,
  useLazyGetAllGruppiQuery
} from '@cmrc/services/src/app/piapi/generated';
import {
  checkTelphoneNumber,
  isNumeric,
  isString,
  isStringStartWithNumber,
  isTaxCodeValid,
  isVatNumberValid
} from '@cmrc/ui/utils/validator-utils';
import { dictionary } from './dictionary';
import { LabelValue } from '../../../../protocollo/protocollo_form/hooks/useProtocolloFormData';
import { useGetContattoInad } from '../hooks/useGetContattoInad';
import EmailIcon from '@mui/icons-material/Email';
import { InputAdornment, Tooltip } from '@mui/material';

export type AnagraficaInitialData = AnagraficaDto & { gruppi: LabelValue[] };

export const useAnagraficaForm = (
  props: { initialData: AnagraficaDto; from: string } = null
) => {
  const [getAllGruppi] = useLazyGetAllGruppiQuery();
  const { getContattoInad, isLoading } = useGetContattoInad();
  const initialData: AnagraficaInitialData = {
    ragioneSociale: props?.initialData?.ragioneSociale,
    nome: props?.initialData?.nome,
    cognome: props?.initialData?.cognome,
    cfPiva: props?.initialData?.cfPiva,
    indirizzo: props?.initialData?.indirizzo,
    citta: props?.initialData?.citta,
    cap: props?.initialData?.cap,
    provincia: props?.initialData?.provincia,
    email: props?.initialData?.email,
    pec: props?.initialData?.pec,
    telefono: props?.initialData?.telefono,
    fax: props?.initialData?.fax,
    note: props?.initialData?.note,
    gruppi:
      props?.initialData?.gruppi?.map((gruppo) => ({
        label: gruppo?.nome,
        value: gruppo?.id
      })) || [],
    certificato: props?.initialData?.certificato,
    cancellato: props?.initialData?.cancellato
  };

  const methods = useForm<AnagraficaInputInput>({
    defaultValues: initialData,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const handleCfPivaSearch = async () => {
    const cfPivaValue = methods.getValues('cfPiva');
    if (cfPivaValue) {
      const result = await getContattoInad(cfPivaValue);
      const pec = result?.getContattoInad;
      if (pec) {
        methods.setValue('pec', pec, {
          shouldValidate: true,
          shouldDirty: true
        });
      }
    }
  };

  const structure: BaseInputProps<AnagraficaInputInput>[] = [
    {
      type: 'text',
      name: 'ragioneSociale',
      label: dictionary.get('ragioneSociale'),
      required: true,
      sx: { width: { xs: 1, sm: 1 / 1 } }
    },
    {
      type: 'text',
      name: 'nome',
      label: dictionary.get('nome'),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'text',
      name: 'cognome',
      label: dictionary.get('cognome'),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'text',
      name: 'cfPiva',
      label: dictionary.get('cfPiva'),
      validation: {
        validate: (value: string) => {
          if (
            value &&
            isStringStartWithNumber(value) &&
            !isVatNumberValid(value)
          ) {
            return dictionary.get('invalidPiva');
          }
          if (
            value &&
            !isStringStartWithNumber(value) &&
            !isTaxCodeValid(value)
          ) {
            return dictionary.get('invalidCf');
          }
          return true;
        }
      },
      componentProps: {
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={dictionary.get('cercaContatto')} placement="top">
                <EmailIcon
                  onClick={handleCfPivaSearch}
                  style={{ cursor: 'pointer' }}
                />
              </Tooltip>
            </InputAdornment>
          )
        }
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    },
    {
      type: 'address',
      name: 'indirizzo',
      label: dictionary.get('indirizzo'),
      sx: { width: { xs: 1, sm: 1 / 1 } },
      validation: {
        validate: (value: string) => {
          const hasCitta = !!methods.getValues('citta')?.trim();
          const hasEmail = !!methods.getValues('email')?.trim();
          const hasPec = !!methods.getValues('pec')?.trim();
          if (!value?.trim() && !hasCitta && !hasPec && !hasEmail) {
            return dictionary.get('campoRequired');
          } else if (value?.trim() && !hasCitta && !hasPec && !hasEmail) {
            return dictionary.get('campoRequired');
          }
          return true;
        }
      }
    },
    {
      type: 'text',
      name: 'citta',
      label: dictionary.get('citta'),
      sx: { width: { xs: 1, sm: 6.5 / 12 } },
      validation: {
        validate: (value: string) => {
          const hasIndirizzo = !!methods.getValues('indirizzo')?.trim();
          const hasEmail = !!methods.getValues('email')?.trim();
          const hasPec = !!methods.getValues('pec')?.trim();
          if (!value?.trim() && !hasIndirizzo && !hasEmail && !hasPec) {
            return dictionary.get('campoRequired');
          } else if (value?.trim() && !hasIndirizzo && !hasPec && !hasEmail) {
            return dictionary.get('campoRequired');
          }
          return true;
        }
      }
    },
    {
      type: 'text',
      name: 'cap',
      label: dictionary.get('cap'),
      componentProps: {
        maxLength: 5
      },
      validation: {
        validate: (value: string) => {
          if (value && !isNumeric(value)) {
            return dictionary.get('invalidCap');
          }
          return true;
        }
      },
      sx: { width: { xs: 1, sm: 3 / 12 } }
    },
    {
      type: 'text',
      name: 'provincia',
      label: dictionary.get('provincia'),
      componentProps: {
        maxLength: 2
      },
      onInput: (value) => value?.toUpperCase(),
      validation: {
        validate: (value: string) => {
          if (value && !isString(value)) {
            return dictionary.get('invalidProvincia');
          }
          return true;
        }
      },
      sx: { width: { xs: 1, sm: 2.5 / 12 } }
    },
    {
      type: 'text',
      name: 'email',
      label: dictionary.get('email'),
      sx: { width: { xs: 1, sm: 1 / 1 } },
      validation: {
        validate: (value: string) => {
          const hasIndirizzo = !!methods.getValues('indirizzo')?.trim();
          const hasCitta = !!methods.getValues('citta')?.trim();
          const hasPec = !!methods.getValues('pec')?.trim();
          if (!value?.trim() && !hasIndirizzo && !hasCitta && !hasPec) {
            return dictionary.get('campoRequired');
          }
          return true;
        }
      }
    },
    {
      type: 'text',
      name: 'pec',
      label: dictionary.get('pec'),
      sx: { width: { xs: 1, sm: 1 / 1 } },
      validation: {
        validate: (value: string) => {
          const hasIndirizzo = !!methods.getValues('indirizzo')?.trim();
          const hasEmail = !!methods.getValues('email')?.trim();
          const hasCitta = !!methods.getValues('citta')?.trim();
          if (!value?.trim() && !hasIndirizzo && !hasCitta && !hasEmail) {
            return dictionary.get('campoRequired');
          }
          return true;
        }
      }
    },
    {
      type: 'tel',
      name: 'telefono',
      label: dictionary.get('telefono'),
      validation: {
        validate: (value) => {
          if (value && !checkTelphoneNumber(value)) {
            return dictionary.get('invalidTelephone');
          }
          return true;
        }
      },
      sx: { width: { xs: 1, sm: 1 / 2 } },
      componentProps: {
        maxLength: 15
      }
    },
    {
      type: 'tel',
      name: 'fax',
      label: dictionary.get('fax'),
      componentProps: {
        maxLength: 15
      },
      validation: {
        validate: (value) => {
          if (value && !checkTelphoneNumber(value)) {
            return dictionary.get('invalidFax');
          }
          return true;
        }
      },
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'select-autocomplete',
      name: 'gruppi',
      label: dictionary.get('gruppi'),
      query: (value) =>
        getAllGruppi({
          ricercaGruppiDTO: {
            search: value ?? '',
            size: 50,
            page: 0
          }
        }),
      optionMapping: ({ data: gruppi }) =>
        gruppi?.getAllGruppi?.gruppiList?.map((gruppo: Gruppo) => ({
          label: gruppo?.nome,
          value: gruppo?.id
        })) || [],
      onSelect: (value, setValue) => {
        setValue('gruppi', value);
      },
      componentProps: {
        multiple: true
      },
      sx:
        props?.from === 'anagrafica'
          ? { width: { xs: 1, sm: 1 / 1 } }
          : { display: 'none' }
    },
    {
      type: 'textarea',
      name: 'note',
      label: dictionary.get('note'),
      componentProps: {
        multiline: true,
        minRows: 2
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    }
  ];

  return { methods, structure };
};
