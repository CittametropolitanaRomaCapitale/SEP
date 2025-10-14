import { FCC } from "@cmrc/types/FCC";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import TableFilter from "@cmrc/ui/components/TableFilter";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SSOApi as api } from "@cmrc/services/sso";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Input from "@cmrc/ui/form/FormComponents/Input";
import { useTable } from "../../../../../../store/table/useTable";
import { dictionary } from "./dictionary";

export interface FiltriPermessiFascicoloProps {
  loading?: boolean;
}

export const FiltriPermessiFascicolo: FCC<FiltriPermessiFascicoloProps> = ({ loading }) => {
  const [cdrList, setCdrList] = useState<{ value: string | number; label: string | JSX.Element }[]>([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { tableData, setSearch, setFilters } = useTable({
    table_id: 'permessiFascicolo'
  });

  const [triggerOffices] = api.endpoints.getApiOffice.useLazyQuery();

  const options = [
    { label: dictionary.get('lettura'), value: dictionary.get('lettura') },
    { label: dictionary.get('scrittura'), value: dictionary.get('scrittura') },
  ];

  const onOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onResetPermessoFilter = () => {
    setAnchorEl(null);
    setFilters({
      ...tableData?.filters,
      permesso: undefined
    });
  };

  /**
   * Gestione del filtro permesso,
   * se l'opzione selezionata è uguale a quella già selezionata, allora viene resettato il filtro
   */
  const onSelectMenu = (option: { label: string; value: string }) => {
    setAnchorEl(null);
    if (option.value === tableData?.filters?.permesso) {
      onResetPermessoFilter();
    } else {
      setFilters({
        ...tableData?.filters,
        permesso: option.value
      });
    }
  };

    /**
   * Query lazy per ottenere la lista degli uffici
   */
  const onOpenCdr = () => {
    triggerOffices({
      by: 'name',
      desc: false
    }).then(({ data: { data: officeData } }) => {
      const filteredOffices = Array.isArray(officeData)
        ? officeData
          .filter((office) => !office.deleted)
          .map((office) => ({
            label: office.name,
            value: `${office.name} - ${office.description}`
          })) : [];
      setCdrList(filteredOffices);
    });
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <Button
        size="small"
        sx={{ mr: 1 }}
        variant="outlined"
        onClick={onOpen}
        endIcon={<FilterListIcon sx={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }} />}
      >
        {dictionary.get('permesso')}
      </Button>
      <Stack
        direction="row"
        spacing={1}
        alignItems="end"
        justifyContent="space-around"
      >
        <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
          {options.map((option) => (
            <MenuItem
              key={option?.value}
              selected={
                option.value === (tableData?.filters?.permesso)
              }
              onClick={() => onSelectMenu(option)}
            >
              {option?.label}
            </MenuItem>
          ))}
        </Menu>
        <TableFilter
          loading={loading}
          label={dictionary.get('cdr')}
          onOpen={onOpenCdr}
          options={cdrList || []}
          onSelectOption={(value: string[]) => setFilters({
            ...tableData?.filters,
            cdr: value
          })
          }
          values={tableData?.filters?.cdr}
        />
      </Stack>
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
  )
}