import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import Select from '@cmrc/ui/form/FormComponents/Select';
import { FCC } from '@cmrc/types/FCC';

const StyledSelect = styled(Select)(() => ({
  padding: '0 8px',
  '& .MuiSelect-multiple:focus': {
    backgroundColor: 'transparent'
  }
}));

export interface TableFilterProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  options?: { value: string | number; label: string | JSX.Element }[];
  values?: string[];
  onSelectOption?: (values: string[]) => void;
  onOpen?: () => void;
}

const TableFilter: FCC<TableFilterProps> = ({
  label,
  loading,
  disabled,
  options,
  values,
  onSelectOption,
  onOpen
}) => {
  const [selectedOptions, setSelectedOptions] = useState(values || []);

  useEffect(() => {
    setSelectedOptions(values || []);
  }, [values]);

  const onChange = (event: any) => {
    const val = event.target.value;
    setSelectedOptions(val);
    if (onSelectOption) onSelectOption(val);
  };

  const onDeleteItem = (value: string | number) => {
    const selected = selectedOptions?.filter((option) => option !== value);
    setSelectedOptions(selected);
    if (onSelectOption) onSelectOption(selected);
  };

  return (
    <StyledSelect
      hiddenLabel
      displayEmpty
      renderValue={(selected: any) => (
        <Stack direction="row" alignItems="center">
          <Typography fontSize="0.8125rem" fontWeight="600">
            {label}
          </Typography>
          {selected?.length > 0 && (
            <Chip
              label={selected?.length}
              size="small"
              sx={{ ml: 1, height: '22px' }}
            />
          )}
        </Stack>
      )}
      SelectDisplayProps={{
        style: {
          background: '#fff',
          border: 0
        }
      }}
      componentsProps={{
        root: {
          style: {
            padding: 0
          }
        },
        input: {
          style: {}
        }
      }}
      disabled={loading || disabled}
      IconComponent={FilterListIcon}
      variant="outlined"
      size="small"
      multiple
      onOpen={onOpen}
      options={options}
      value={selectedOptions}
      sx={{ maxWidth: '220px', background: '#fff' }}
      onChange={onChange}
      onDeleteItem={onDeleteItem}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: '300px'
          }
        }
      }}
    />
  );
};

export default TableFilter;
