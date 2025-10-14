import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { RaccomandataProtocolloInputInput } from '@cmrc/services/src/app/piapi/generated';
import { MittenteRaccomandataForm } from '../MittenteRaccomandataForm';
import { DestinatarioRaccomandataForm } from '../DestinatarioRaccomandataForm';
import { DocumentoRaccomandataForm } from '../DocumentoRaccomandataForm';
import { TipologiaInvioRaccomandataForm } from '../TipologiaInvioRaccomandataForm';

export const useRaccomandataForm = (defaultValues, readMode) => {
  const methods = useForm<RaccomandataProtocolloInputInput>({
    defaultValues: readMode && defaultValues,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange',
  });

  const structure: BaseInputProps<RaccomandataProtocolloInputInput>[] = [
    {
      type: 'custom',
      name: 'documentoSection',
      render: () => (
        <DocumentoRaccomandataForm
          formMethod={methods}
          readMode={readMode}
        />
      )
    },
    {
      type: 'custom',
      name: 'mittenteSection',
      render: () => (
        <MittenteRaccomandataForm
          formMethod={methods}
          readMode={readMode}
        />
      )
    },
    {
      type: 'custom',
      name: 'destinatarioSection',
      render: () => (
        <DestinatarioRaccomandataForm
          formMethod={methods}
          readMode={readMode}
        />
      )
    },
    {
      type: 'custom',
      name: 'tipologiaInvioSection',
      render: () => (
        <TipologiaInvioRaccomandataForm
          formMethod={methods}
          readMode={readMode}
        />
      )
    }
  ]

  return { methods, structure };
};