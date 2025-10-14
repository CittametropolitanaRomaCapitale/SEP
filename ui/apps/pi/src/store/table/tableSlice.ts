import { SortInputInput } from '@cmrc/services';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

export type TableData = {
  page?: number;
  search?: string;
  sort?: SortInputInput;
  filters?: any;
  selectedRows?: any[];
};

type State = {
  tables: { [key: string]: TableData };
};

const slice = createSlice({
  name: 'table',
  initialState: { tables: {} },
  reducers: {
    page: (
      state: State,
      action: PayloadAction<{ table_id: string; page: number }>
    ) => {
      state.tables[action.payload.table_id] = {
        ...state.tables[action.payload.table_id],
        page: action.payload.page
      };
    },
    search: (
      state: State,
      action: PayloadAction<{ table_id: string; search: string }>
    ) => {
      state.tables[action.payload.table_id] = {
        ...state.tables[action.payload.table_id],
        search: action.payload.search
      };
    },
    sort: (
      state: State,
      action: PayloadAction<{ table_id: string; sort: SortInputInput }>
    ) => {
      state.tables[action.payload.table_id] = {
        ...state.tables[action.payload.table_id],
        sort:
          action.payload.sort?.by !== undefined
            ? action.payload.sort
            : undefined
      };
    },
    filter: (
      state: State,
      action: PayloadAction<{ table_id: string; filters: any }>
    ) => {
      state.tables[action.payload.table_id] = {
        ...state.tables[action.payload.table_id],
        filters: action.payload.filters
      };
    },
    selectedRows: (
      state: State,
      action: PayloadAction<{ table_id: string; rows: any[] }>
    ) => {
      state.tables[action.payload.table_id] = {
        ...state.tables[action.payload.table_id],
        selectedRows: action.payload.rows
      };
    },
    clear: (state: State, action: PayloadAction<{ table_id: string }>) => {
      state.tables[action.payload.table_id] = {};
    }
  }
});

export const { page, search, sort, filter, selectedRows, clear } =
  slice.actions;

export const selectTableState = (state: RootState) => state.table;

export default slice.reducer;
