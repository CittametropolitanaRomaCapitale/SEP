import { FCC } from '@cmrc/types/FCC';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { useGetApiApplicationQuery } from '@cmrc/services/sso';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList';
import { dictionary } from './dictionary';
import { useTable } from '../../../store/table/useTable';

export interface FiltriRuoliAmministrazioneUtenteUtenteProps {
  loading?: boolean;
}

const FiltriRuoliAmministrazioneUtente: FCC<
  FiltriRuoliAmministrazioneUtenteUtenteProps
> = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [applicazione, setApplicazione] = useState(null);
  const { tableData, setFilters } = useTable({
    table_id: 'ruoliAmministrazione'
  });

  const open = Boolean(anchorEl);

  const onOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onSelectMenu = (option: { name: string; id: string | number }) => {
    setAnchorEl(null);
    setApplicazione(option.name);
    setFilters({
      ...tableData?.filters,
      applicationId: option.id
    });
  };

  const onResetApplicationFilter = () => {
    setAnchorEl(null);
    setApplicazione(null);
    setFilters({
      ...tableData?.filters,
      applicationId: undefined
    });
  };

  const { data: applicationsData, isLoading: isLoadingApplications } =
    useGetApiApplicationQuery();

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <Button
        variant="outlined"
        disabled={isLoadingApplications}
        sx={{ minWidth: '200px' }}
        size="small"
        startIcon={<FilterListIcon />}
        onClick={onOpen}
      >
        {applicazione || dictionary.get('applicazioni')}
      </Button>
      <Stack
        direction="row"
        spacing={1}
        alignItems="end"
        justifyContent="space-around"
      >
        <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
          <MenuItem
            selected={!tableData?.filters?.applicationId}
            onClick={onResetApplicationFilter}
          >
            {dictionary.get('tutteApplicazioni')}
          </MenuItem>
          {(applicationsData as any[])?.map((option) => (
            <MenuItem
              key={option?.id}
              selected={option?.id === tableData?.filters?.applicationId}
              onClick={() => onSelectMenu(option)}
            >
              {option.name}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Stack>
  );
};

export default FiltriRuoliAmministrazioneUtente;
