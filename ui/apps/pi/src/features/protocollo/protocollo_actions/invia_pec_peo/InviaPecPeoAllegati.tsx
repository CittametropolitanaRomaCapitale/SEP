import { Box, Card, Grid } from '@mui/material';
import { FCC } from '@cmrc/types/FCC';
import TableExternalHeader from '@cmrc/ui/components/Table/TableExternalHeader';
import { UseFormReturn } from 'react-hook-form';
import { RaccomandataProtocolloInputInput } from '@cmrc/services/src/app/piapi/generated';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import { dictionary } from './dictionary';
import { useInviaPecPeoAllegatiTable } from './hooks/useInviaPecPeoAllegatiTable';
import { useGetAllegatiProtocolloListQuery } from '../../hooks/useDataAllegatiProtocollo';
import EnhancedTable from '../../../../components/NewTable';
import SearchAllegatiProtocolloList from './SearchAllegatiProtocolloList';
import { PaginationAllegatiProtocolloList } from './PaginationAllegatiProtocolloList';
import { useEffect, useState } from 'react';

export interface InviaPecPeoAllegatiProps {
  formMethod: UseFormReturn<any, RaccomandataProtocolloInputInput>;
  readMode?: boolean;
}

export const InviaPecPeoAllegati: FCC<InviaPecPeoAllegatiProps> = ({
  formMethod
}) => {
  const { columns } = useInviaPecPeoAllegatiTable();
  const { data, isLoading, isFetching } = useGetAllegatiProtocolloListQuery();
  const [defaultRowSelected, setDefaultRowSelected] = useState([]);

  const handleOnSelectedRow = (row) => {
    formMethod.setValue(
      'allegati',
      row.map((r) => r.id)
    );
  };

  useEffect(() => {
    if (data?.getAllegati?.allegati?.length > 0) {
      const preselected = data.getAllegati.allegati.filter(
        (a) => a.idUtente != null
      );

      formMethod.setValue(
        'allegati',
        preselected.map((a) => a.id)
      );
      setDefaultRowSelected(preselected);
    }
  }, [data, formMethod]);

  return (
    <>
      <Box sx={{ marginBottom: 1 }}>
        <TableExternalHeader title={dictionary.get('allegatiHeader')} />
      </Box>
      <Card sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 3 }}>
        <Grid
          item
          sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 0, marginBottom: 1 }}
        >
          <TableTopBar
            leftElement={<SearchAllegatiProtocolloList />}
            rightElement={<PaginationAllegatiProtocolloList />}
          />
          <EnhancedTable
            loading={isLoading || isFetching}
            columns={columns}
            data={data?.getAllegati?.allegati}
            multiSelectable
            selectable
            onSelectRow={(row) => handleOnSelectedRow(row)}
            defaultRowSelected={defaultRowSelected}
          />
        </Grid>
      </Card>
    </>
  );
};
