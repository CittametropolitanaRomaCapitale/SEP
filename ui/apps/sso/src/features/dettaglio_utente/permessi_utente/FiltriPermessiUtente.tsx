import { FCC } from '@cmrc/types/FCC';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import Stack from '@mui/material/Stack';
import { useGetApiApplicationQuery } from '@cmrc/services/sso';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList';
import TableFilter from '@cmrc/ui/components/TableFilter';
import { dictionary } from './dictionary';
import { useTable } from '../../../store/table/useTable';
import { useGetUtente } from '../useGetUtente';

export interface FiltriPermessiUtenteProps {
  loading?: boolean;
}

const FiltriPermessiUtente: FCC<FiltriPermessiUtenteProps> = ({ loading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [applicazione, setApplicazione] = useState(null);
  const [ruoli, setRuoli] = useState(null);
  const { tableData, setSearch, setFilters } = useTable({
    table_id: 'permessiUtente'
  });

  const open = Boolean(anchorEl);

  const onOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onSelectMenu = (option: {
    name: string;
    id: string | number;
    applicationRoles: any[];
  }) => {
    setAnchorEl(null);
    setApplicazione(option.name);
    setRuoli(option.applicationRoles);
    setFilters({
      ...tableData?.filters,
      applicationId: option.id
    });
  };

  const onResetApplicationFilter = () => {
    setAnchorEl(null);
    setApplicazione(null);
    setRuoli(null);
    setFilters({
      ...tableData?.filters,
      applicationId: undefined
    });
  };

  const { data: applicationsData, isLoading: isLoadingApplications } =
    useGetApiApplicationQuery();

  const { data: userData, isLoading: isLoadingUser } = useGetUtente();

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
        {applicazione || 'Applicazioni'}
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

        <TableFilter
          loading={isLoadingApplications}
          label={dictionary.get('ruolo')}
          disabled={!applicazione}
          options={
            ruoli?.map((item) => ({
              label: item?.role?.name,
              value: item?.role?.id
            })) || []
          }
          onSelectOption={(value: string[]) =>
            setFilters({
              applicationId: tableData?.filters?.applicationId,
              roleIds: value,
              cdrs: tableData?.filters?.cdrs
            })
          }
          values={tableData?.filters?.roleIds}
        />

        <TableFilter
          loading={isLoadingUser}
          label={dictionary.get('cdr')}
          options={
            userData?.userOfficesForDelegation?.map((item) => ({
              label: item?.office?.name,
              value: item?.office?.name
            })) || []
          }
          onSelectOption={(value: string[]) =>
            setFilters({
              applicationId: tableData?.filters?.applicationId,
              roleIds: tableData?.filters?.roleIds,
              cdrs: value
            })
          }
          values={tableData?.filters?.cdrs}
        />
      </Stack>

      <Input
        sx={{ display: 'flex', flexGrow: '1' }}
        disabled={loading}
        inputLeftElement={<SearchIcon />}
        placeholder={dictionary.get('cerca')}
        size="medium"
        variant="standard"
        value={tableData?.search || ''}
        onChange={(event) => setSearch(event.target.value)}
      />
    </Stack>
  );
};

export default FiltriPermessiUtente;
