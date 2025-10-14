import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import { useEffect } from 'react';
import { useTable } from '../../../store/table/useTable';
import { dictionary } from './dictionary';

export const SearchBarRegistroGiornalieroList = () => {
	const { tableData, setSearch } = useTable({
		table_id: 'registroGiornaliero'
	});

	useEffect(() => {
		setSearch('')
	}, [])

	return (
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
	);
};
