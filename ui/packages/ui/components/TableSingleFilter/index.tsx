import { useEffect, useState } from 'react';
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

export interface TableSingleFilterProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  value?: string;
  clearable?: boolean;
  onSelectOption?: (value: string) => void;
}

const TableSingleFilter: FCC<TableSingleFilterProps> = ({
  label,
  loading,
  disabled,
  options,
  value,
  clearable = true,
  onSelectOption
}) => {
  const [selectedOption, setSelectedOption] = useState(value || '');

  useEffect(() => {
    setSelectedOption(value || '');
  }, [value]);

  const onChange = (event: any) => {
    const val = event.target.value;
    setSelectedOption(val);
    if (onSelectOption) onSelectOption(val);
  };

  return (
    <StyledSelect
      hiddenLabel
      displayEmpty
      renderValue={(selected: any) => (
        <Stack direction="row" alignItems="center">
          <Typography fontSize="0.8125rem" fontWeight="600">
            {selected ? selected : label}
          </Typography>
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
      options={[
        ...(clearable ? [{ label: 'Tutti', value: '' }] : []),
        ...options
      ]}
      value={selectedOption}
      sx={{ maxWidth: '220px', background: '#fff' }}
      onChange={onChange}
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

export default TableSingleFilter;
