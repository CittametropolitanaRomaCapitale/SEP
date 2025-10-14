import { useEffect, useState } from 'react';
import { SSOApi as api } from '@cmrc/services/sso';
import { FCC } from '@cmrc/types/FCC';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@cmrc/ui/form/FormComponents/Input';
import TableFilter from '@cmrc/ui/components/TableFilter';
import { useOffice } from '@cmrc/auth/useOffice';
import { dictionary } from '../dictionary';
import { useTable } from '../../../../../../../store/table/useTable';

type FiltriListaPecPeoProps = {
  loading: boolean;
}

export const FiltriListaPecPeo: FCC<FiltriListaPecPeoProps> = ({ loading }) => {
  const [cdrList, setCdrList] = useState<{ value: string | number; label: string | JSX.Element }[]>([]);
  const { tableData, setSearch, setFilters } = useTable({
    table_id: 'configurazioniPecPeo'
  });

  const { cdrCode } = useOffice();
  const [triggerOffices] = api.endpoints.getApiOffice.useLazyQuery();

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
            value: office.code
          })) : [];
      setCdrList(filteredOffices);
    });
  }

  useEffect(() => {
    setFilters({
      ...tableData?.filters,
      ruolo: undefined
    });
  }, [cdrCode]);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row', md: 'row' }}
      spacing={1}
      justifyContent="flex-start"
      alignItems="end"
    >
      <Stack
        direction={{ xs: 'column', sm: 'row', md: 'row' }}
        spacing={1}
        justifyContent="flex-start"
        alignItems="end"
      >
        <TableFilter
          loading={loading}
          label={dictionary.get('tipo')}
          options={[
            { label: dictionary.get('pec'), value: dictionary.get('pec') },
            { label: dictionary.get('peo'), value: dictionary.get('peo') },
          ]}
          onSelectOption={(value: string[]) => {
            setFilters({
              ...tableData?.filters,
              tipologiaPosta: value
            })
          }
          }
          values={tableData?.filters?.tipologiaPosta}
        />
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
          values={tableData?.filters?.cdrCode}
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
};
