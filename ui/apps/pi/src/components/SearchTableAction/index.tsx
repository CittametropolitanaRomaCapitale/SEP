import { FCC } from '@cmrc/types/FCC';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export interface SearchTableActionProps {
  isLoading?: boolean;
  isSelectDisabled?: boolean;
  onSelectRow?: () => void;
}

const SearchTableAction: FCC<SearchTableActionProps> = ({
  isLoading,
  isSelectDisabled,
  onSelectRow
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-end'
    }}
  >
    <LoadingButton
      onClick={() => {
        if (onSelectRow) onSelectRow();
      }}
      size="small"
      loading={isLoading}
      disabled={isSelectDisabled}
      sx={{ width: '30px', height: '30px', minWidth: '30px', mr: 1 }}
    >
      <AddCircleOutlineIcon />
    </LoadingButton>
  </Box>
);

export default SearchTableAction;
