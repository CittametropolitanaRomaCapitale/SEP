import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import {
  ReferenteProtocolloInputInput,
  TipoRegistrazione
} from '@cmrc/services/src/app/piapi/generated';
import { useTable } from '../../../../../../store/table/useTable';
import { GetDataReferentiProvider } from '../../../../../../hooks/useDataReferenti';
import { RicercaReferenti } from '../../../../../protocollo/protocollo_form/ricerca_referenti/RicercaReferenti';
import { dictionary } from '../dictionary';

export const useAssegnaProtocolloMassivoForm = () => {
  const [openSearchDestinatariCompetenza, setOpenSearchDestinatariCompetenza] =
    useState(false);
  const { setSearch } = useTable({
    table_id: 'ricercaReferenti'
  });

  const methods = useForm<any>({
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const handleAddItems = (name, items) => {
    const currentValue = methods.getValues(name) || [];

    const filteredNewItems = items.filter(
      (newItem) =>
        !currentValue.some(
          (currentItem) => currentItem.idDestinatario === newItem.idDestinatario
        )
    );

    const uniqueNewItems = filteredNewItems.filter(
      (newItem, index, self) =>
        index ===
        self.findIndex((item) => item.idDestinatario === newItem.idDestinatario)
    );

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
      title: dictionary.get('assegnaMassivoDialog'),
      label: dictionary.get('assegnatari'),
      componentProps: {
        multiple: true,
        searchBody: (
          <GetDataReferentiProvider
            tipoRegistrazione={TipoRegistrazione.Entrata}
          >
            <RicercaReferenti
              onAddItems={(item) => handleAddItems('assegnatari', item)}
              onSearchClose={() => {
                setOpenSearchDestinatariCompetenza(false);
                setSearch('');
              }}
              tipoRegistrazione={TipoRegistrazione.Entrata}
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
