import { FCC } from '@cmrc/types/FCC';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import { useTable } from '../../../store/table/useTable';
import { dictionary } from '../dictionary';

export interface FiltriUtentiProps {
  loading?: boolean;
}

const FiltriUtenti: FCC<FiltriUtentiProps> = ({ loading }) => {
  const { tableData, setSearch } = useTable({
    table_id: 'utentiUfficio'
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

export default FiltriUtenti;
