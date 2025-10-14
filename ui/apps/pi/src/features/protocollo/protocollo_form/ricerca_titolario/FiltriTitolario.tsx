import { FCC } from '@cmrc/types/FCC';
import TableFilter from '@cmrc/ui/components/TableFilter';
import { dictionary } from './dictionary';

export interface FiltriTitolarioProps {
  loading?: boolean;
  disabled?: boolean;
  onSelectedOptions: (...args: any[]) => void;
  tableData: any;
  setFiltersList?: (filters: any) => void;
  hideFilterForFascicoliDeleted?: boolean;
}

const filterOptions = [
  {
    label: dictionary.get('hideFascicoliDeleted'),
    value: 'hideFascicoliDeleted'
  },
  {
    label: dictionary.get('showFascicoliWithDocumenti'),
    value: 'showFascicoliWithDocumenti'
  },
  {
    label: dictionary.get('showFascicoliWithProtocolli'),
    value: 'showFascicoliWithProtocolli'
  }
];

export const FiltriTitolario: FCC<FiltriTitolarioProps> = ({
  loading,
  disabled,
  onSelectedOptions,
  tableData,
  setFiltersList,
  hideFilterForFascicoliDeleted
}) => {
  return (
    <TableFilter
      disabled={disabled}
      loading={loading}
      label={dictionary.get('filtri')}
      options={hideFilterForFascicoliDeleted ? filterOptions.filter((f) => f.value !== 'hideFascicoliDeleted') : filterOptions}
      onSelectOption={(selectedFilter: string[]) => {
        if (onSelectedOptions) {
          onSelectedOptions(selectedFilter);
        }
        if (setFiltersList) {
          setFiltersList({
            hideFascicoliDeleted: selectedFilter.includes('hideFascicoliDeleted'),
            showFascicoliWithDocumenti: selectedFilter.includes('showFascicoliWithDocumenti'),
            showFascicoliWithProtocolli: selectedFilter.includes('showFascicoliWithProtocolli')
          });
        }
      }}
      values={tableData?.filters?.stato}
    />
  );
};
