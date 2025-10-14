import { useState } from 'react';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { UseFormReturn } from 'react-hook-form';
import Chip from '@mui/material/Chip';
import { Tooltip } from '@mui/material';
import { useTable } from '../../../../store/table/useTable';
import { ProtocolloForm } from './useDestinatariProtocolloForm';
import { dictionary } from '../ricerca_titolario/dictionary';
import { RootState, useSelector } from '../../../../store';
import { GetDataTitolarioProvider } from '../../../../hooks/useDataTitolario';
import { RicercaTitolario } from '../ricerca_titolario/RicercaTitolario';

export interface TitolarioProtocolloFormProps {
  readMode?: boolean;
  formMethod: UseFormReturn<ProtocolloForm, any>;
  titolarioRequired?: boolean;
}

export const useTitolarioProtcolloForm = ({
  readMode,
  formMethod,
  titolarioRequired
}: TitolarioProtocolloFormProps) => {
  const [openSearch, setOpenSearch] = useState(false);
  const initialData = useSelector(
    (state: RootState) => state.protocollo.initialData
  );
  const [idPadre, setIdPadre] = useState();

  const [lastIndex, setLastIndex] = useState(-1);
  const [lastIdTitolario, setLastIdTitolario] = useState(-1);

  const { setSearch } = useTable({
    table_id: 'ricercaTitolario'
  });

  const handleAddItems = (items) => {
    const currentValue = formMethod.getValues('idTitolario') || [];

    // Filtra gli elementi che non sono già inseriti nella lista titolari
    const filteredNewItems = items.filter(
      (newItem) =>
        !currentValue.some((currentItem) => currentItem.id === newItem.id)
    );

    // Filtra gli elementi che non sono duplicati nella lista della nuova selezione
    const uniqueNewItems = filteredNewItems.filter(
      (newItem, index, self) =>
        index === self.findIndex((item) => item.id === newItem.id)
    );

    // Se ci sono nuovi titolari li aggiunge
    if (uniqueNewItems.length > 0) {
      const updatedValue = [...currentValue, ...uniqueNewItems];
      formMethod.setValue('idTitolario', updatedValue);
      formMethod.clearErrors('idTitolario');
    }
  };

  // Effettua l'override del contenuto della select. Per ogni chip si mostra un tooltip con la gerarchia del fascicolo
  const showTooltipHierarchy = (value, getTagProps) =>
    value.map((option, index) => {
      return (
        <Tooltip title={option?.hierarchyString} arrow>
          <Chip
            size="small"
            label={option.label}
            {...{
              ...getTagProps({ index }),
              onDelete: option?.visible
                ? getTagProps({ index }).onDelete
                : undefined
            }}
          />
        </Tooltip>
      );
    });

  const structure: BaseInputProps<ProtocolloForm>[] = [
    {
      type: 'searchable-textField',
      name: 'idTitolario',
      required:
        (!readMode || initialData?.canUpdateProtocollo) && titolarioRequired,
      title: dictionary.get('titolario'),
      label: dictionary.get('titolario'),
      disabled: initialData && !initialData?.canUpdateProtocollo,
      componentProps: {
        multiple: true,
        searchBody: (
          <GetDataTitolarioProvider
            idPadre={idPadre}
            lastIdTitolario={lastIdTitolario}
            startIndex={lastIndex}
            showFascicoliChiusi={false}
            showFascicoliDeleted={false}
            hideFascicoliDeleted={true}
            showFascicoliForProtocolli={false}
            showFascicoliWithDocumenti={false}
            showFascicoliWithProtocolli={false}
          >
            <RicercaTitolario
              minHeight={400}
              onChangeItem={(item) => {
                setIdPadre(item?.id);
              }}
              onAddItems={(item) => handleAddItems(item)}
              onSearchClose={() => {
                setOpenSearch(false);
                setSearch('');
                setLastIdTitolario(-1);
                setLastIndex(-1);
                setIdPadre(null);
              }}
              hideFilterForFascicoliDeleted={true}
              setIndexesForSearch={(lastIdTitolario, startIndex) => {
                setLastIdTitolario(lastIdTitolario);
                setLastIndex(startIndex);
              }}
            />
          </GetDataTitolarioProvider>
        ),
        searchOpen: openSearch,
        onSearchOpen: () => setOpenSearch(true),
        onSearchClose: () => {
          setOpenSearch(false);
          setSearch('');
          setIdPadre(null);
        },
        fullScreen: false,
        renderTags: showTooltipHierarchy
      },
      sx: { width: { xs: 1, sm: 1 / 1 } }
    }
  ];

  return { structure };
};
