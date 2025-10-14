import { useEffect, useState } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { ReferenteOutputDto } from '@cmrc/services/src/app/piapi/generated';
import { useGetReferentiList } from '../../hooks/useDataReferenti';
import LoadingContainer from '../LoadingContainer';
import { useTable } from '../../store/table/useTable';
import { dictionary } from '../../dictionary';
import TreeView from '../TreeView';

export interface SelectedItem {
  idDestinatario: string;
  label: string;
  value: string;
  tipo: string;
}

interface OrganigrammaTreeViewProps {
  onSelectedItemsChange: (selectedItems: SelectedItem[]) => void;
}

export const OrganigrammaTreeView: FCC<OrganigrammaTreeViewProps> = ({
  onSelectedItemsChange
}) => {
  const { isLoading, isFetching, data } = useGetReferentiList();

  const [expandedItemsIds, setExpandedItemsIds] = useState([]);
  const [selectionForOrganigramma, setSelectionForOrganigramma] = useState([]);
  const [selectedIdsForOrganigramma, setSelectedIdsForOrganigramma] = useState(
    []
  );

  // Recupera le informazioni di ciascun item selezionato (id, label, tipo)
  const findItemById = (
    items: ReferenteOutputDto[],
    id: string
  ): SelectedItem | null => {
    let foundItem: SelectedItem | null = null;

    items.some((item) => {
      if (item?.id === id) {
        foundItem = {
          idDestinatario: item?.idDestinatario,
          label: item?.label,
          value: item?.idDestinatario,
          tipo: item?.tipo
        };
        return true;
      }
      if (item?.children) {
        foundItem = findItemById(item?.children, id);
        return foundItem !== null;
      }
      return false;
    });

    return foundItem;
  };
  // Recupera l'id dell'item selezionato
  const findItemIdByIdDestinatario = (
    items: ReferenteOutputDto[],
    id: string,
    fatherId: string
  ): string[] | null => {
    let foundItem: string[] | null = null;

    items.some((item) => {
      if (item?.idDestinatario === id) {
        foundItem = [fatherId, item.id];
        return true;
      }
      if (item?.children) {
        foundItem = findItemIdByIdDestinatario(item?.children, id, item.id);
        return foundItem !== null;
      }
      return false;
    });

    return foundItem;
  };

  useEffect(() => {
    const selectedIdsInOrganigramma = [];
    const expandedItems = [];
    for (let i = 0; i < selectionForOrganigramma.length; i += 1) {
      const referenteId = findItemIdByIdDestinatario(
        data?.findReferenti?.referenti,
        selectionForOrganigramma[i].idDestinatario,
        null
      );

      if (
        referenteId !== null &&
        referenteId[0] !== null &&
        expandedItems.indexOf(referenteId[0]) < 0
      ) {
        expandedItems.push(referenteId[0]);
      }
      if (referenteId !== null) selectedIdsInOrganigramma.push(referenteId[1]);
    }
    setExpandedItemsIds(expandedItems);
    setSelectedIdsForOrganigramma(selectedIdsInOrganigramma);
  }, [data]);

  // TODO: table_id deve diventare una props per renderlo generico
  const { tableData } = useTable({
    table_id: 'ricercaReferenti'
  });

  const handleItemSelectionToggle = (
    event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean
  ) => {
    const referente = findItemById(data?.findReferenti.referenti, itemId);
    if (!referente) return;
    
    let parentLabel = null;
    for(let i=0;i<data?.findReferenti.referenti.length;i+=1) {
      if (data?.findReferenti.referenti[i].children !== null) {
        for(let j=0;j<data?.findReferenti.referenti[i].children.length;j+=1) {
          if (data?.findReferenti.referenti[i].children[j].id === itemId) {
            parentLabel = data?.findReferenti.referenti[i].label;
          }
        }
      }
    }
    /*
    const parent = data?.findReferenti?.referenti?.find((p) =>
      p?.children?.some((c) => c?.idDestinatario === referente.idDestinatario)
    );
    */

    const referenteCdr = {
      ...referente,
      cdrAssegnatario: parentLabel // parent?.label ?? null
    };

    const selectedIds = [...selectedIdsForOrganigramma];
    const selectionCompleteForOrganigramma = [...selectionForOrganigramma];

    if (isSelected) {
      selectionCompleteForOrganigramma.push(referenteCdr);
      selectedIds.push(itemId);
    } else {
      for (
        let i = selectionCompleteForOrganigramma.length - 1;
        i >= 0;
        i -= 1
      ) {
        if (
          selectionCompleteForOrganigramma[i].idDestinatario ===
          referente.idDestinatario
        ) {
          selectionCompleteForOrganigramma.splice(i, 1);
        }
      }
      for (let i = selectedIds.length - 1; i >= 0; i -= 1) {
        if (selectedIds[i] === itemId) {
          selectedIds.splice(i, 1);
        }
      }
    }
    setSelectedIdsForOrganigramma(selectedIds);
    setSelectionForOrganigramma(selectionCompleteForOrganigramma);
    onSelectedItemsChange(selectionCompleteForOrganigramma);
  };

  let defaultExpandedItems = [];
  if (tableData?.search) {
    defaultExpandedItems = data?.findReferenti?.referenti?.map(
      (referente) => referente.id
    );
  } else if (expandedItemsIds.length > 0) {
    defaultExpandedItems = expandedItemsIds;
  }

  return (
    <LoadingContainer isLoading={isLoading || isFetching}>
      {data?.findReferenti?.referenti?.length > 0 ? (
        <TreeView
          selectedItems={selectedIdsForOrganigramma}
          multiSelect
          checkboxSelection
          items={
            data?.findReferenti?.referenti ? data?.findReferenti?.referenti : []
          }
          onItemSelectionToggle={handleItemSelectionToggle}
          defaultExpandedItems={defaultExpandedItems}
        />
      ) : (
        <h3 style={{ textAlign: 'center' }}>
          {dictionary.get('nessunRisultato')}
        </h3>
      )}
    </LoadingContainer>
  );
};
