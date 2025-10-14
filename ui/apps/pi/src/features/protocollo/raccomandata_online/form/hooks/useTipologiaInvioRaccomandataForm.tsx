import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import { RaccomandataProtocolloInputInput, TipoRaccomandata } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../../dictionary';

export const useTipologiaInvioRaccomandataForm = () => {

  const structure: BaseInputProps<RaccomandataProtocolloInputInput>[] = [
    {
      type: 'select',
      name: 'tipo',
      required: true,
      label: dictionary.get('tipoSpedizione'),
      options: Object.values(TipoRaccomandata)?.map((tipo) => ({
        label: toSentence(tipo),
        value: tipo
      })),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    }
  ]
  return { structure };
}