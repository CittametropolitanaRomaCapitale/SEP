import React, {
  useMemo,
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
  ForwardedRef
} from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef
} from '@tanstack/react-table';

import { FCC } from '@cmrc/types/FCC';
import { styled } from '@mui/material';
import MUITable from '@mui/material/Table';
import Checkbox from '@cmrc/ui/form/FormComponents/Checkbox';
import MUITableContainer from '@mui/material/TableContainer';
import type { TableProps as MUITableProps } from '@mui/material';
import TableHead from './TableHead';
import TableBody from './TableBody';
import TableEmpty from './TableEmpty';
import { SkeletonTableBody } from './SkeletonTableBody';

// Interfaces
interface TableData {
  id: string | number;
  [key: string]: any;
}

type TableProps = {
  columns: any;
  data?: TableData[];
  loading?: boolean;
  error?: Error;
  skeletonRows?: number;
  hideHead?: boolean;
  selectable?: boolean;
  disabledCheckbox?: boolean;
  multiSelectable?: boolean;
  emptyTableText?: string;
  emptyTableSubText?: string;
  emptyTableButton?: JSX.Element;
  ref?: ForwardedRef<any>;
  defaultSort?: SortingState;
  onSelectRow?: (selectedRows: any[]) => void;
  onSort?: (sortState: SortingState) => void;
  onRowClick?: any;
  defaultRowSelected?: TableData[];
} & MUITableProps;

const StyledTable = styled(MUITable)(({ theme }) => ({
  '& .MuiTableRow-root': {
    backgroundColor: 'white',
    borderBottom: `1px solid ${
      theme.palette.mode === 'light' ? '#E6E8F0' : '#303030'
    }`
  }
}));

const EnhancedTable: FCC<TableProps> = forwardRef(
  (
    {
      loading = false,
      error,
      columns = [],
      data = [],
      skeletonRows = 5,
      hideHead = false,
      selectable = false,
      disabledCheckbox = false,
      multiSelectable = true,
      emptyTableText,
      emptyTableSubText,
      emptyTableButton,
      defaultSort = [],
      onSelectRow,
      onSort,
      onRowClick,
      defaultRowSelected
    },
    ref
  ) => {
    const [sorting, setSorting] = useState<SortingState>(defaultSort || []);
    const handleDefaultRowSelection = (
      rows: TableData[] | undefined
    ): Record<string, boolean> => {
      if (!rows || rows.length === 0) return {};
      const acc : Record<string, boolean> = {};
      rows.forEach(row => {
        acc[row.id.toString()] = true;
      });
      return acc;
    };
    const [rowSelection, setRowSelection] = useState(() =>
      handleDefaultRowSelection(defaultRowSelected)
    );
    useEffect(() => {
      setRowSelection(handleDefaultRowSelection(defaultRowSelected));
    }, [defaultRowSelected]);
    const [selectedRows, setSelectedRows] = useState<TableData[]>([]);
    /**
     * Questo use gestisce la persistenza dei dati in caso sia abilitata la selezione degli elementi della table 'selectable'.
     * Garantisce la persistenza della selezione
     */
    useEffect(() => {
      if (onSelectRow && !loading) {
        const currentPageSelectedRows = Object.keys(rowSelection)
          .filter((key) => rowSelection[key])
          .map((key) => data.find((row) => row.id.toString() === key))
          .filter(Boolean);

        const updatedSelectedRows = [...selectedRows];

        currentPageSelectedRows.forEach((row) => {
          const index = updatedSelectedRows.findIndex((r) => r.id === row.id);
          if (index === -1) {
            updatedSelectedRows.push(row);
          }
        });

        const currentPageIds = new Set(data.map((row) => row.id.toString()));
        const filteredRows = updatedSelectedRows.filter(
          (row) =>
            !currentPageIds.has(row.id.toString()) ||
            rowSelection[row.id.toString()]
        );

        // filteredRows.forEach((elem) => {
        //   console.log(`RowSelection: ID:${elem?.id} | r.sociale: ${elem?.ragioneSociale} | nome: ${elem?.nome} ${elem?.cognome} `)
        // })
        setSelectedRows(filteredRows);
        onSelectRow(filteredRows);
      }
    }, [rowSelection]);

    const tableColumns = useMemo(() => {
      if (selectable) {
        const selectionCell: ColumnDef<unknown> = {
          id: 'selection',
          size: 40,
          // eslint-disable-next-line react/no-unstable-nested-components
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              disabled={!multiSelectable || (selectable && disabledCheckbox)}
              onChange={table.getToggleAllRowsSelectedHandler()}
              onClick={(e) => e.stopPropagation()}
            />
          ),
          // eslint-disable-next-line react/no-unstable-nested-components
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              disabled={selectable && disabledCheckbox}
              onChange={row.getToggleSelectedHandler()}
              onClick={(e) => e.stopPropagation()}
            />
          )
        };

        return [selectionCell, ...columns];
      }

      return columns;
    }, [columns, selectable]);

    const tableData = useMemo(() => {
      if (error) return [];
      return data || [];
    }, [data, error]);

    const table = useReactTable({
      data: tableData,
      columns: tableColumns,
      defaultColumn: {
        minSize: 30,
        size: 150
      },
      state: {
        sorting,
        rowSelection
      },
      initialState: {
        sorting: defaultSort
      },
      enableRowSelection: selectable,
      enableMultiRowSelection: multiSelectable,
      enableExpanding: true,
      manualSorting: true, // questa proprietà serve in quanto il sort dei dati avviene lato backend
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getRowId: (row) => row.id?.toString() ?? ''
    });

    useImperativeHandle(ref, () => ({
      clearSelectedRows() {
        table.resetRowSelection();
      }
    }));

    useEffect(() => {
      if (onSort) onSort(sorting);
    }, [sorting]);

    return (
      <MUITableContainer>
        <StyledTable>
          {!hideHead && table.getRowModel().rows.length > 0 && (
            <TableHead headerGroups={table.getHeaderGroups()} />
          )}
          {loading && (
            <SkeletonTableBody
              skeletonRows={skeletonRows}
              columnsCount={tableColumns.length}
            />
          )}
          {!loading && table.getRowModel().rows.length > 0 && (
            <TableBody
              rows={table.getRowModel().rows}
              onRowClick={onRowClick}
            />
          )}
          {!loading && (table?.getRowModel()?.rows?.length === 0 || error) && (
            <TableEmpty
              emptyTableText={emptyTableText}
              emptyTableSubText={emptyTableSubText}
              emptyTableButton={emptyTableButton}
            />
          )}
        </StyledTable>
      </MUITableContainer>
    );
  }
);

export default EnhancedTable;
