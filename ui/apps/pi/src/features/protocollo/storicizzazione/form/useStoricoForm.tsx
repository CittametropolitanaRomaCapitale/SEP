import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { useForm } from 'react-hook-form';
import { dictionary } from '../dictionary';
import { useEffect, useState } from 'react';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ArticleIcon from '@mui/icons-material/Article';

type StoricoForm = {
  filterSwitch: string;
};

export const useStoricoForm = (
  cdr: string,
  onFilterChange: (value: boolean) => void
) => {
  const methods = useForm({
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const [filterByCdr, setFilterByCdr] = useState<boolean>(true);

  useEffect(() => {
    onFilterChange(true);
  }, []);

  const structure: BaseInputProps<StoricoForm>[] = [
    {
      type: 'switch',
      name: 'filterSwitch',
      checked: !filterByCdr,
      title: filterByCdr
        ? dictionary.get('filtraPerCdr', { cdr: cdr })
        : dictionary.get('storicoCompleto'),
      onChange: (value) => {
        setFilterByCdr(!value);
        onFilterChange?.(!value);
      },
      icon: <ApartmentIcon />,
      checkedIcon: <ArticleIcon />
    }
  ];

  return { methods, structure };
};
