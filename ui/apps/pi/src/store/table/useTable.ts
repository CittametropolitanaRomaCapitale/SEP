import { ColumnSort, SortingState } from '@tanstack/react-table'
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  page as pageAction,
  search as searchAction,
  sort as sortAction,
  filter as filterAction,
  selectedRows as selectedRowsAction,
  clear as clearAction,
  TableData
} from './tableSlice';

export const useTable = (args: { table_id: string }) => {
  const dispatch = useAppDispatch();

  const setPage = (page: number): void => {
    dispatch(pageAction({ table_id: args?.table_id, page }));
  };

  const setSearch = (search: string): void => {
    dispatch(searchAction({ table_id: args?.table_id, search }));
    setPage(0);
  };
  const setFilters = (filters: any): void => {
    dispatch(filterAction({ table_id: args?.table_id, filters }));
    setPage(0);
  };

  const setSort = (argsSort: {
    table_id: string;
    sort: SortingState;
  }): void => {
    dispatch(
      sortAction({
        table_id: argsSort?.table_id,
        sort: { by: argsSort?.sort[0]?.id, desc: argsSort?.sort[0]?.desc }
      })
    );
  };

  const setSelectedRows = (rows: any[]): void => {
    dispatch(selectedRowsAction({ table_id: args?.table_id, rows }));
  };

  const clearTable = (): void => {
    dispatch(clearAction({ table_id: args?.table_id }));
  };

  const tableData: TableData = useAppSelector(
    (state) => state.table.tables[args?.table_id]
  );

  return {
    setPage,
    setSearch,
    setSort,
    setFilters,
    setSelectedRows,
    clearTable,
    tableData
  };
};
