import { FCC } from '@cmrc/types/FCC';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import { useTable } from '../../../../store/table/useTable';
import { dictionary } from './dictionary';

const SearchDocumentiFascicolo: FCC = () => {

  const { tableData, setSearch } = useTable({
    table_id: 'listaDocumentiFascicolo'
  });

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="left"
    >
      <Input
        sx={{ display: 'flex', flexGrow: '1' }}
        inputLeftElement={<SearchIcon />}
        placeholder={dictionary.get('cerca')}
        size="medium"
        variant="standard"
        value={tableData?.search || ''}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
      />
    </Stack>
  );
};

export default SearchDocumentiFascicolo;