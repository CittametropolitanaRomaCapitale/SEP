import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import {
  ReferenteProtocolloInputInput,
  TipoRegistrazione
} from '@cmrc/services/src/app/piapi/generated';
import { useState } from 'react';
import { dictionary } from '../dictionary';
import { useTable } from '../../../../../store/table/useTable';
import { RicercaReferenti } from '../../../protocollo_form/ricerca_referenti/RicercaReferenti';
import { GetDataReferentiProvider } from '../../../../../hooks/useDataReferenti';

export const useAssegnaForm = (protocolloData) => {
  const [openSearchDestinatariCompetenza, setOpenSearchDestinatariCompetenza] =
    useState(false);
  const { setSearch } = useTable({
    table_id: 'ricercaReferenti'
  });
  const metodoSpedizione = protocolloData?.metodoSpedizione;

  const [tipoRicercaIpaCompetenza, setTipoRicercaIpaCompetenza] =
    useState(null);
  const [isInadCompetenza, setIsInadCompetenza] = useState(false);
  const [ipaSelectedCodAoo, setIpaSelectedCodAoo] = useState(null);
  const [ipaSelectedCodAmm, setIpaSelectedCodAmm] = useState(null);

  const methods = useForm<any>({
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const handleAddItems = (name, items) => {
    const currentValue = methods.getValues(name) || [];

    // Filtra gli elementi che non sono già inseriti nella lista destinatari
    const filteredNewItems = items.filter(
      (newItem) =>
        !currentValue.some(
          (currentItem) => currentItem.idDestinatario === newItem.idDestinatario
        )
    );

    // Filtra gli elementi che non sono duplicati nella lista della nuova selezione
    const uniqueNewItems = filteredNewItems.filter(
      (newItem, index, self) =>
        index ===
        self.findIndex((item) => item.idDestinatario === newItem.idDestinatario)
    );

    // Se ci sono nuovi destinatari li aggiunge
    if (uniqueNewItems.length > 0) {
      const updatedValue = [...currentValue, ...uniqueNewItems];
      methods.setValue(name, updatedValue);
      methods.clearErrors('assegnatari');
    }
  };

  const structure: BaseInputProps<ReferenteProtocolloInputInput>[] = [
    {
      type: 'searchable-textField',
      name: 'assegnatari',
      required: true,
      title: dictionary.get('assegna'),
      label: dictionary.get('assegnatari'),
      componentProps: {
        multiple: true,
        searchBody: (
          <GetDataReferentiProvider
            tipoRegistrazione={TipoRegistrazione.Entrata}
            metodoSpedizione={metodoSpedizione}
            isInad={isInadCompetenza}
            tipoRicercaIPA={tipoRicercaIpaCompetenza}
            ipaSelectedCodAmm={ipaSelectedCodAmm}
            ipaSelectedCodAoo={ipaSelectedCodAoo}
          >
            <RicercaReferenti
              onAddItems={(item) => handleAddItems('assegnatari', item)}
              onSearchClose={() => {
                setOpenSearchDestinatariCompetenza(false);
                setSearch('');
              }}
              tipoRegistrazione={TipoRegistrazione.Entrata}
              metodoSpedizione={metodoSpedizione}
              onTabChanged={(tab) => {
                setTipoRicercaIpaCompetenza(tab === 'ipa' ? 'enti' : null);
                setIsInadCompetenza(tab === 'inad');
              }}
              onIpaTriggerRicercaEnti={() => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(null);
                setTipoRicercaIpaCompetenza('enti');
              }}
              onIpaTriggerRicercaAOO={(codAmm) => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(codAmm);
                setTipoRicercaIpaCompetenza('aoo');
              }}
              onIpaTriggerRicercaUO={(codAmm) => {
                setIpaSelectedCodAoo(null);
                setIpaSelectedCodAmm(codAmm);
                setTipoRicercaIpaCompetenza('uo');
              }}
            />
          </GetDataReferentiProvider>
        ),
        searchOpen: openSearchDestinatariCompetenza,
        onSearchOpen: () => setOpenSearchDestinatariCompetenza(true),
        onSearchClose: () => {
          setOpenSearchDestinatariCompetenza(false);
          setSearch('');
        },
        fullScreen: false
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    },
    {
      type: 'text',
      name: 'noteAssegnazione',
      label: dictionary.get('note'),
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
