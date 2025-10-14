import { FCC } from '@cmrc/types/FCC';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import TableFilter from '@cmrc/ui/components/TableFilter';
import { useOffice } from '@cmrc/auth/useOffice';
import { MetodoSpedizione, StatoProtocollo, TipoRegistrazione } from '@cmrc/services/src/app/piapi/generated';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import { useTable } from '../../../../store/table/useTable';
import { dictionary } from '../dictionary';

export interface FiltriProtocolliFascicoloProps {
  loading?: boolean;
}

const FiltriProtocolliFascicolo: FCC<FiltriProtocolliFascicoloProps> = ({ loading }) => {
  const { cdrCode } = useOffice();
  const toExcludeStatoProtocollo = ['DaPrendereInCarico', 'Rifiutato', 'Assegnato', 'PresoInCarico']

  const { tableData, setSearch, setFilters } = useTable({
    table_id: 'listaProtocolliFascicolo'
  });

  useEffect(() => {
    setFilters({
      ...tableData?.filters,
      ruolo: undefined
    });
  }, [cdrCode]);

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="left"
    >
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
          label={dictionary.get('metodoDiSpedizione')}
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
            })
          }
          }
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

export default FiltriProtocolliFascicolo;
