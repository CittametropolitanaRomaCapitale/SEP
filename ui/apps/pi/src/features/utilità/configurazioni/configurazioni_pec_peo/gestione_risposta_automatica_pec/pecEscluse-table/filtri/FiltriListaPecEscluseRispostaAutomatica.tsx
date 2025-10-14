import { FCC } from '@cmrc/types/FCC';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import { dictionary } from '../../dictionary';
import { useTable } from '../../../../../../../store/table/useTable';

export const FiltriListaPecEscluseRispostaAutomatica: FCC = () => {
  const { tableData, setSearch } = useTable({
    table_id: 'configurazioniPecEscluseRispostaAutomatica'
  });

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row', md: 'row' }}
      spacing={1}
      justifyContent="flex-start"
      alignItems="end"
    >
      <Input
        inputLeftElement={<SearchIcon />}
        fullWidth
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
