import { useForm } from 'react-hook-form';
import {
  TitolarioInputInput,
  TitolarioOutputDto
} from '@cmrc/services/src/app/piapi/generated';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { dictionary } from '../../dictionary';
import { useRicercaTitolario } from '../../../../protocollo/protocollo_form/hooks/useRicercaTitolario';
import { useGetMaxLivelloFascicolazione } from '../../../../utilità/configurazioni/configurazioni_pec_peo/gestione_livello_fascicolazione/hooks/useGetMaxLivelloFascicolazione';

export type TitolarioFormValues = TitolarioInputInput & {
  label?: string;
};

export const useTitolarioFormDrawer = (props: {
  breadcrumb?: TitolarioOutputDto[];
  defaultValues: TitolarioOutputDto;
  canEditForm: boolean;
}) => {
  const { isFascicoloLevel, isFascicoloLastLevel } = useRicercaTitolario();
  const { data: numeroMassimoLivelli } = useGetMaxLivelloFascicolazione();
  const { breadcrumb, defaultValues, canEditForm } = props;
  const isModifica = defaultValues && defaultValues.id;
  const isLastLevel = isFascicoloLastLevel(
    breadcrumb,
    numeroMassimoLivelli?.getMaxLivelloFascicolazioneForTitolario
  );
  const lastDayOfTheYear = new Date(
    new Date().getFullYear(),
    11,
    31,
    23,
    59,
    59
  ).toISOString();

  const methods = useForm<TitolarioFormValues>({
    defaultValues: {
      ...defaultValues,
      tsChiusura: defaultValues?.tsChiusura || lastDayOfTheYear,
      leaf: isLastLevel || defaultValues?.leaf,
      nome: defaultValues?.label
    },
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<TitolarioFormValues>[] = [
    {
      type: 'text',
      name: 'nome',
      label: dictionary.get('nome'),
      required: true,
      disabled: !canEditForm,
      componentProps: {
        multiline: true,
        minRows: 2,
        maxRows: 5,
        maxLength: 255
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    },
    {
      type: 'text',
      name: 'note',
      label: dictionary.get('note'),
      disabled: !canEditForm,
      componentProps: {
        multiline: true,
        minRows: 3,
        maxRows: 5,
        maxLength: 255
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    }
  ];

  if (isFascicoloLevel(breadcrumb)) {
    structure.push({
      type: 'date',
      name: 'tsChiusura',
      required: isModifica,
      label: dictionary.get('tsChiusura'),
      clearable: true,
      disabled: !canEditForm,
      clearText: 'Cancella',
      sx: { width: { xs: 1, sm: 1 / 1 } },
      disablePast: true
    });
  }

  if (isFascicoloLevel(breadcrumb)) {
    structure.push({
      type: 'checkbox',
      name: 'leaf',
      disabled: isLastLevel || !canEditForm,
      label: dictionary.get('checkBoxLabel'),
      sx: { width: { xs: 1, sm: 1 / 1 } }
    });
  }

  return { methods, structure };
};
