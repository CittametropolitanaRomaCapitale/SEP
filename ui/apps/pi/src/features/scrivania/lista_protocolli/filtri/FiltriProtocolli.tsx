import { FCC } from '@cmrc/types/FCC';
import { MouseEvent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import TableFilter from '@cmrc/ui/components/TableFilter';
import { useOffice } from '@cmrc/auth/useOffice';
import { MetodoSpedizione, StatoProtocollo, TipoRegistrazione } from '@cmrc/services/src/app/piapi/generated';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { useTable } from '../../../../store/table/useTable';
import { dictionary } from '../dictionary';

export interface FiltriProtocolliProps {
  loading?: boolean;
}

/* Stati protocollo
DaAssegnare
InCorso
Completato
RichiestaDiAnnullamento
Annullato
*/

const toExcludeStatoProtocollo = ['DaPrendereInCarico', 'Rifiutato', 'Assegnato', 'PresoInCarico']
const options = [
  { label: dictionary.get('iMieiCompiti'), value: 'LE_MIE_ATTIVITA', info: 'Questa lista contiene tutti i protocolli assegnati alla mia utenza e/o al mio ufficio.' },
  { label: dictionary.get('ilMioUfficio'), value: 'IL_MIO_UFFICIO', info: 'Questa lista contiene le PEC in entrata, i protocolli creati dal mio ufficio e i protocolli lavorati dal mio ufficio.' },
  { label: dictionary.get('all'), value: 'ALL', info: 'Questa lista contiene tutti i protocolli presenti nel sistema.' }
];

const FiltriProtocolli: FCC<FiltriProtocolliProps> = ({ loading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { cdrCode, isUserPIAdmin } = useOffice();
  const open = Boolean(anchorEl);
  const { tableData, setSearch, setFilters } = useTable({
    table_id: 'listaProtocolli'
  });

  const onOpen = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onSelectMenu = (option: { label: string; value: string }) => {
    setAnchorEl(null);
    setFilters({
      ...tableData?.filters,
      filtro: option.value,
      advancedFilters: undefined
    });
  };

  useEffect(() => {
    setFilters({
      ...tableData?.filters,
      ruolo: undefined,
      advancedFilters: undefined
    });
  }, [cdrCode]);

  let filteredOptions = options;
  if (!isUserPIAdmin) {
    filteredOptions = options.filter(option => option.value !== 'ALL');
  }
  
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="left"
    >
      <Button
        variant="outlined"
        disabled={loading}
        sx={{ minWidth: '200px' }}
        size="small"
        endIcon={<FilterListIcon sx={{
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }} />}
        onClick={onOpen}
      >
        <Tooltip
          title={
            filteredOptions.find(
              (item) =>
                item?.value === (tableData?.filters?.filtro || filteredOptions[0]?.value)
            )?.info
          }
          placement="top"
        >
          <span>
            {
              filteredOptions.find(
                (item) =>
                  item?.value === (tableData?.filters?.filtro || filteredOptions[0]?.value)
              )?.label
            }
            <InfoIcon sx={{ fontSize: 'small', marginLeft: '3px' }} />
          </span>
        </Tooltip>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        {filteredOptions.map((option) => (
          <MenuItem
            sx={{ minWidth: '200px' }}
            key={option?.value}
            selected={
              option.value === (tableData?.filters?.filtro || filteredOptions[0]?.value)
            }
            onClick={() => onSelectMenu(option)}
          >
            {option?.label}
          </MenuItem>
        ))}
      </Menu>
      <Stack
        direction="row"
        spacing={1}
        alignItems="end"
        justifyContent="space-between"
      >
        <TableFilter
          loading={loading}
          label={dictionary.get('tipoRegistrazione')}
          options={Object.values(TipoRegistrazione).map((tipologia) => ({
            label: tipologia,
            value: tipologia
          }))}
          onSelectOption={(value: string[]) =>
            setFilters({
              ...tableData?.filters,
              tipoRegistrazione: value
            })
          }
          values={tableData?.filters?.tipoRegistrazione}
        />
        <TableFilter
          loading={loading}
          label={dictionary.get('metodoSpedizione')}
          options={Object.values(MetodoSpedizione).map((metodo) => ({
            label: dictionary.get(`metodoDiSpedizione${metodo}`),
            value: metodo
          }))}
          onSelectOption={(value: string[]) =>
            setFilters({
              ...tableData?.filters,
              metodoSpedizione: value
            })
          }
          values={tableData?.filters?.metodoSpedizione}
        />
        <TableFilter
          loading={loading}
          label={dictionary.get('stato')}
          options={Object.values(StatoProtocollo)
            .filter((stato) => !toExcludeStatoProtocollo.includes(stato))
            .map((stato) => ({
              label: toSentence(stato),
              value: stato
            }))}
          onSelectOption={(value: string[]) => {
            setFilters({
              ...tableData?.filters,
              stato: value
            });
          }}
          values={tableData?.filters?.stato}
        />
      </Stack>
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

export default FiltriProtocolli;
