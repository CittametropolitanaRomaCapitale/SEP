import { useState } from 'react';
import { FCC } from '@cmrc/types/FCC';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import { dictionary } from './dictionary';
import { useTable } from '../../store/table/useTable';
import Select from '@cmrc/ui/form/FormComponents/Select';
import { Stack } from '@mui/material';

export interface FiltriUtentiProps {
  loading?: boolean;
}

const FiltriUtenti: FCC<FiltriUtentiProps> = ({ loading }) => {
  const { tableData, setSearch, setFilters } = useTable({
    table_id: 'listaUtenti'
  });

  const [inputSearchTimeout, setInputSearchTimeout] = useState(null);
  const [inputSearchValue, setInputSearchValue] = useState('');

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="left"
    >
      <Select
        sx={{width:'200px'}}
        size='small'
        label={dictionary.get('usersEnabledFilter')}
        options={[
          {label: dictionary.get('allUsersStates'), value:0}, 
          {label: dictionary.get('onlyEnabled'), value:1}, 
          {label: dictionary.get('onlyDisabled'), value:2}
        ]}
        onChange={(event) => {
          console.log(setFilters);
          setFilters({
            ...tableData?.filters,
            enabled: event.target.value
          })
        }}
        value={tableData?.filters?.enabled || 0}
      />
      <Input
        sx={{ display: 'flex', flexGrow: '1' }}
        disabled={loading}
        inputLeftElement={<SearchIcon />}
        placeholder={dictionary.get('cerca')}
        size="medium"
        variant="standard"
        value={inputSearchValue}
        onChange={(event) => {
          setInputSearchValue(event.target.value);
          if (inputSearchTimeout) {
            clearTimeout(inputSearchTimeout);
          }
          setInputSearchTimeout(setTimeout(() => {
            setSearch(event.target.value);
          }, 300));
        }}
      />
    </Stack>
  );
};

export default FiltriUtenti;
