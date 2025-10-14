import { FCC } from "@cmrc/types/FCC";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { StatoRaccomandataProtocollo } from "@cmrc/services/src/app/piapi/generated";
import { toSentence } from "@cmrc/ui/utils/string-utils";
import { dictionary } from "../dictionary";
import { useTable } from "../../../../store/table/useTable";

export interface FiltriRaccomandateProtocolloListProps {
  loading?: boolean;
}
export const FiltriRaccomandateProtocolloList: FCC<FiltriRaccomandateProtocolloListProps> = ({ loading }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { tableData, setFilters } = useTable({
    table_id: 'raccomandateProtocollo'
  });

  const options = Object.values(StatoRaccomandataProtocollo)?.map((stato) => ({
    label: toSentence(stato),
    value: stato
  }))

  const onOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onResetStatoFilter = () => {
    setAnchorEl(null);
    setFilters({
      ...tableData?.filters,
      stato: undefined
    });
  };

  /**
   * Gestione del filtro STATO,
   * se l'opzione selezionata è uguale a quella già selezionata, allora viene resettato il filtro
   */
  const onSelectMenu = (option: { label: string; value: string }) => {
    setAnchorEl(null);
    if (option.value === tableData?.filters?.stato) {
      onResetStatoFilter();
    } else {
      setFilters({
        ...tableData?.filters,
        stato: option.value
      });
    }
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <Button
        disabled={loading}
        size="small"
        sx={{ mr: 1 }}
        variant="outlined"
        onClick={onOpen}
        endIcon={<FilterListIcon sx={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }} />}
      >
        {dictionary.get('statoRaccomandata')}
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
                option.value === (tableData?.filters?.stato)
              }
              onClick={() => onSelectMenu(option)}
            >
              {option?.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Stack>
  )
}