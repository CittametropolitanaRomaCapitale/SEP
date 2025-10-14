import { FCC } from '@cmrc/types/FCC';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import { dictionary } from './dictionary';
import { useTable } from '../../../store/table/useTable';

export interface FiltriDelegheUtenteProps {
  loading?: boolean;
  table_id?: string;
}

const FiltriDelegheUtente: FCC<FiltriDelegheUtenteProps> = ({
  loading,
  table_id
}) => {
  const { tableData, setSearch } = useTable({
    table_id
  });

  return (
    <Input
      sx={{ width: '100%' }}
      disabled={loading}
      inputLeftElement={<SearchIcon />}
      placeholder={dictionary.get('cerca')}
      size="medium"
      variant="standard"
      value={tableData?.search || ''}
      onChange={(event) => setSearch(event.target.value)}
    />
  );
};

export default FiltriDelegheUtente;
