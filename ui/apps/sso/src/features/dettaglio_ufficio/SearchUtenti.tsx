import { useState } from 'react';
import { FCC } from '@cmrc/types/FCC';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import { dictionary } from './dictionary';

export interface SearchUtentiProps {
  onSearch?: (any) => void;
}

const SearchUtenti: FCC<SearchUtentiProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const onChange = (event) => {
    onSearch(event.target.value);
    setInputValue(event.target.value);
  };

  return (
    <Input
      sx={{ width: '100%' }}
      inputLeftElement={<SearchIcon />}
      placeholder={dictionary.get('cerca')}
      size="medium"
      variant="standard"
      value={inputValue || ''}
      onChange={onChange}
    />
  );
};

export default SearchUtenti;
