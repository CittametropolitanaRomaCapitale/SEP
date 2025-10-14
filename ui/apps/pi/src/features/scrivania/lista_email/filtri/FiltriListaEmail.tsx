import { useEffect } from 'react';
import { FCC } from '@cmrc/types/FCC';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import TableFilter from '@cmrc/ui/components/TableFilter';
import { useOffice } from '@cmrc/auth/useOffice';
import { useAuth } from '@cmrc/ui/hooks/use-auth';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import { useTable } from '../../../../store/table/useTable';
import { dictionary } from '../dictionary';
import {
  StatoClassificazione,
  StatoAssegnazione,
  StatoLavorazionePec
} from '../../../../utils/types';
export interface FiltriEmailProps {
  loading?: boolean;
  indirizziEmail: any[];
  onIndirizziSelected: (list: any[]) => void;
}

export const FiltriListaEmail: FCC<FiltriEmailProps> = ({
  loading,
  onIndirizziSelected,
  indirizziEmail
}) => {
  const { tableData, setSearch, setFilters } = useTable({
    table_id: 'listaEmail'
  });
  const { user } = useAuth();
  const { cdrCode, roles } = useOffice();

  useEffect(() => {
    setFilters({
      ...tableData?.filters,
      ruolo: undefined
    });
  }, [cdrCode]);

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row', md: 'row' }} spacing={1}>
        <TableFilter
          loading={loading}
          label={dictionary.get('indirizzoPEC')}
          options={
            indirizziEmail !== null
              ? indirizziEmail.map((indirizzoEmail) => ({
                  label: indirizzoEmail,
                  value: indirizzoEmail
                }))
              : []
          }
          onSelectOption={(value: string[]) => {
            onIndirizziSelected(value);
            setFilters({
              ...tableData?.filters,
              indirizziEmail: value
            });
          }}
          values={tableData?.filters?.indirizziEmail}
        />
        <TableFilter
          loading={loading}
          label={toSentence(dictionary.get('statoLavorazione'))}
          options={Object.values(StatoLavorazionePec).map(
            (statoLavorazionePec) => ({
              label: toSentence(statoLavorazionePec),
              value: statoLavorazionePec
            })
          )}
          onSelectOption={(value: string[]) =>
            setFilters({
              ...tableData?.filters,
              mostraNonLavorate: value
            })
          }
          values={tableData?.filters?.mostraNonLavorate}
        />
        <TableFilter
          loading={loading}
          label={toSentence(dictionary.get('statoAssegnazione'))}
          options={Object.values(StatoAssegnazione).map(
            (statoAssegnazione) => ({
              label: toSentence(statoAssegnazione),
              value: statoAssegnazione
            })
          )}
          onSelectOption={(value: string[]) =>
            setFilters({
              ...tableData?.filters,
              isAssegnato: value
            })
          }
          values={tableData?.filters?.isAssegnato}
        />
        <TableFilter
          loading={loading}
          label={toSentence(dictionary.get('statoClassificazione'))}
          options={Object.values(StatoClassificazione).map(
            (statoClassificazione) => ({
              label: toSentence(statoClassificazione),
              value: statoClassificazione
            })
          )}
          onSelectOption={(value: string[]) =>
            setFilters({
              ...tableData?.filters,
              isClassificato: value
            })
          }
          values={tableData?.filters?.isClassificato}
        />
      </Stack>
      <Input
        inputLeftElement={<SearchIcon />}
        fullWidth
        placeholder={dictionary.get('cercaMail')}
        size="medium"
        variant="standard"
        value={tableData?.search || ''}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
      />
    </>
  );
};
