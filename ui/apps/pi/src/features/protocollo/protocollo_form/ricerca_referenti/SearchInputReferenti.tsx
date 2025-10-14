import React, { useState, useEffect } from 'react';
import Input from "@cmrc/ui/form/FormComponents/Input";
import SearchIcon from '@mui/icons-material/Search';
import { useTable } from "../../../../store/table/useTable";
import { dictionary } from "./dictionary";

export const SearchInputReferenti = ({ onSearchChanged }) => {

  const { tableData, setSearch } = useTable({
    table_id: 'ricercaReferenti'
  });
  const [searchValue, setSearchValue] = useState(tableData?.search || '');
  const [searchInputTimeout, setSearchInputTimeout] = useState(null);

  useEffect(() => {
    if (tableData?.search !== searchValue) {
      setSearchValue(tableData?.search || '');
    }
  }, [tableData?.search]);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    if (searchInputTimeout !== null) {
      clearTimeout(searchInputTimeout);
      setSearchInputTimeout(null);
    }

    const sTimeout = setTimeout(() => {
      if (value.length === 0) {
        setSearch('');
      }
      else {
        onSearchChanged(value);
        setSearch(value);
      }
    }, 400);
    setSearchInputTimeout(sTimeout);
  };

  return (
    <Input
      sx={{ display: 'flex', flexGrow: '1' }}
      inputLeftElement={<SearchIcon />}
      placeholder={dictionary.get('cerca')}
      size="medium"
      variant="standard"
      value={searchValue}
      onChange={handleSearch}
    />
  );
};
