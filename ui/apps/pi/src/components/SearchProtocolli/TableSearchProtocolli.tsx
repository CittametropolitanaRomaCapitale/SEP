import { FCC } from '@cmrc/types/FCC';
import TableTopBar from '@cmrc/ui/components/TableTopBar';
import { Protocollo, RicercaProtocolliDtoInput } from '@cmrc/services/src/app/piapi/generated';
import { SortingState } from '@tanstack/react-table';
import Pagination from '../Pagination';
import { useGetQuerySearchProtocolliList } from '../../hooks/useDataSearchProtocolliList';
import { useTableSearchProtocolliList } from '../../hooks/useTableSearchProtocolliList';
import { dictionary } from '../../dictionary';
import { FormSearchProtocolli } from './FormSearchProtocolli';
import EnhancedTable from '../NewTable';

export const TableSearchProtocolli: FCC<{
  defaultValues?: RicercaProtocolliDtoInput;
  onSelectItem?: (protocollo?: Protocollo) => void;
}> = ({ onSelectItem, defaultValues }) => {
  const { columns, setSort } = useTableSearchProtocolliList({
    onSelectItem
  });
  const { data, isLoading, isFetching } = useGetQuerySearchProtocolliList();
  return (
    <>
      <TableTopBar
        rightElement={
          <Pagination
            table_id="searchProtocolliList"
            count={data?.getProtocolli?.pageCount}
          />
        }
        leftElement={<FormSearchProtocolli defaultValues={defaultValues} />}
      />
      <EnhancedTable
        loading={isLoading || isFetching}
        columns={columns}
        data={data?.getProtocolli?.protocolli}
        emptyTableText={dictionary.get('emptySearchTable')}
        onSort={(sort: SortingState) => {
          setSort({ table_id: 'searchProtocolliList', sort })
        }}
      />
    </>
  );
};
