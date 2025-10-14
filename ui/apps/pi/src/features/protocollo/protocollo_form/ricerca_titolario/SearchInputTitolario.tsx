import { ChangeEvent, useEffect, useState } from "react";
import { FCC } from "@cmrc/types/FCC";
import Input from "@cmrc/ui/form/FormComponents/Input";
import SearchIcon from '@mui/icons-material/Search';
import { useTable } from "../../../../store/table/useTable";
import { dictionary } from "./dictionary";

export type SearchInputTitolarioProps = {
  disabled?: boolean;
  onSearch?: (searchValue: string) => void;
};

export const SearchInputTitolario : FCC<SearchInputTitolarioProps> = ( {disabled, onSearch} ) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchInputTimeout, setSearchInputTimeout] = useState(null);
  const { tableData } = useTable({
    table_id: 'ricercaTitolario'
  });

  useEffect(() => {
    if (tableData?.search !== searchValue) {
      setSearchValue(tableData?.search || '');
    }
  }, [tableData?.search]);

  const handleSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValue(value);


    if (searchInputTimeout !== null) {
      clearTimeout(searchInputTimeout);
      setSearchInputTimeout(null);
    }
    const sTimeout = setTimeout(() => {
      setSearchInputTimeout(null);
      if (value.length === 0) {
        //setSearch('');
        onSearch('');
      }
      else if (value.length >= 3) {
        //setSearch(value);
        onSearch(value);
      }
    }, 400);
    setSearchInputTimeout(sTimeout);
  }

  return (
    <Input
      sx={{ display: 'flex', flexGrow: '1' }}
      inputLeftElement={<SearchIcon />}
      placeholder={dictionary.get('cerca')}
      size="medium"
      variant="standard"
      value={searchValue}
      onChange={handleSearch}
      disabled={disabled}
    />
  )
}
