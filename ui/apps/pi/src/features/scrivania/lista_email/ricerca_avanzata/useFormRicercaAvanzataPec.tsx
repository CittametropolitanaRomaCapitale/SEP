import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import {
  EmailDirection,
  StatoInvio,
  TipologiaPosta
} from '@cmrc/services/src/app/piapi/generated';
import { StatoProtocollazione } from '../../../../utils/types';
import { RicercaEmailDtoInput } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';
import { useTable } from '../../../../store/table/useTable';
import { LabelValue } from '../../../protocollo/protocollo_form/hooks/useProtocolloFormData';
import {
  statoInvioToExclude,
  tipoToExclude
} from '../../../../utils/email_utilities';

export type RicercaAvanzataForm = RicercaEmailDtoInput & {
  advUfficio: LabelValue[];
  advStato: string | string[];
  advMetodoSpedizione: string[];
  advTipoRegistrazione: string[];
  advTag: LabelValue[];
};

const typeExclude = tipoToExclude;
const statoInvioExclude = statoInvioToExclude;

export const useFormRicercaAvanzataPec = (
  props: { initialData?: RicercaAvanzataForm } = null
) => {
  const { tableData } = useTable({
    table_id: 'listaEmail'
  });
  const methods = useForm<RicercaAvanzataForm>({
    defaultValues: {
      ...props?.initialData,
      advTag:
        props?.initialData?.advTag !== undefined
          ? props.initialData.advTag
          : undefined,
      advStato:
        props?.initialData?.advStato !== undefined
          ? String(props.initialData.advStato).split(',')
          : undefined,
      advMetodoSpedizione:
        props?.initialData?.advMetodoSpedizione !== undefined
          ? String(props.initialData.advMetodoSpedizione).split(',')
          : undefined,
      advTipoRegistrazione:
        props?.initialData?.advTipoRegistrazione !== undefined
          ? String(props.initialData.advTipoRegistrazione).split(',')
          : undefined
    },
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<RicercaAvanzataForm>[] = [
    {
      type: 'select',
      name: 'tipoEmail',
      label: dictionary.get('tipoEmail'),
      componentProps: {
        multiple: true
      },
      options: Object.values(TipologiaPosta)
        .filter((tipologia) => !typeExclude.includes(tipologia))
        .map((tipologia) => ({
          label: toSentence(tipologia),
          value: tipologia
        }))
    },
    {
      type: 'select',
      name: 'statoProtocollazione',
      label: dictionary.get('statoProtocollazione'),
      componentProps: {
        multiple: true
      },
      options: Object.values(StatoProtocollazione).map(
        (statoProtocollazione) => ({
          label: toSentence(statoProtocollazione),
          value: statoProtocollazione
        })
      )
    },
    {
      type: 'select',
      name: 'emailDirection',
      label: dictionary.get('emailDirectionRicerca'),
      componentProps: {
        multiple: true
      },
      options: Object.values(EmailDirection).map((direction) => ({
        label: toSentence(direction),
        value: direction
      }))
    },
    {
      type: 'select',
      name: 'statoInvio',
      label: dictionary.get('statoInvioRicerca'),
      componentProps: {
        multiple: true
      },
      options: Object.values(StatoInvio)
        .filter((statoInvio) => !statoInvioExclude.includes(statoInvio))
        .map((statoInvio) => ({
          label: toSentence(statoInvio),
          value: statoInvio
        })),
      sx: { width: { xs: 1 } }
    },
    {
      type: 'date',
      name: 'dataInvioFrom',
      label: dictionary.get('dataDa'),
      clearable: true,
      clearText: 'Cancella',
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'date',
      name: 'dataInvioTo',
      label: dictionary.get('dataA'),
      clearable: true,
      clearText: 'Cancella',
      sx: { width: { xs: 1, sm: 1 / 2 } }
    }
  ];

  return { methods, structure };
};
