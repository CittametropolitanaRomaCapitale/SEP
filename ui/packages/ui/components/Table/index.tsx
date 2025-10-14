import React, {
  useMemo,
  useEffect,
  useState,
  useImperativeHandle,
  ForwardedRef,
  forwardRef
} from 'react';
import {
  useTable,
  useSortBy,
  useExpanded,
  useFlexLayout,
  useRowSelect,
  SortingRule,
  TableInstance
} from 'react-table';
import { useSticky } from 'react-table-sticky';
import type { TableProps as MUITableProps } from '@mui/material';

import Box from '@mui/material/Box';
import MUISkeleton from '@mui/material/Skeleton';
import MUITable from '@mui/material/Table';
import MUITableContainer from '@mui/material/TableContainer';

import { styled } from '@mui/material';
import TableHead from './TableHead';
import TableBody from './TableBody';
import Checkbox from '../../form/FormComponents/Checkbox';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FCC } from '@cmrc/types/FCC';

export type TableProps = {
  columns?: any[];
  data?: any[];
  prevData?: any;
  loading?: boolean;
  error?: any;
  skeletonRows?: number;
  hideHead?: boolean;
  defaultExpanded?: boolean;
  subRowComponent?: JSX.Element;
  emptyTableText?: string;
  emptyTableSubText?: string;
  emptyTableButton?: JSX.Element;
  expandable?: boolean;
  expandedRowLeftIcon?: JSX.Element;
  selectable?: boolean;
  multiSelectable?: boolean;
  ref?: ForwardedRef<any>;
  defaultSort?: SortingRule<any>[];
  onSelectRow?: any;
  onRowClick?: any;
  onSort?: any;
  onCellsSelected?: any;
} & MUITableProps;

const StyledTable = styled(MUITable)(({ theme }) => ({
  border: 0
}));

const Table: FCC<TableProps> = forwardRef(
  (
    {
      loading,
      error,
      columns,
      data,
      prevData,
      skeletonRows = 5,
      hideHead,
      defaultExpanded,
      subRowComponent,
      emptyTableText,
      emptyTableSubText,
      emptyTableButton,
      expandable,
      expandedRowLeftIcon,
      selectable,
      multiSelectable = true, // default multiselect = true
      defaultSort,
      onSelectRow,
      onRowClick,
      onSort,
      onCellsSelected,
      ...props
    },
    ref
  ) => {
    const defaultColumn = useMemo(
      () => ({
        minWidth: 30,
        width: 150
      }),
      []
    );

    let selectedCellsInitialState = {};
    data?.forEach((item) => {
      for (let key in item) {
        if (item[`${key}SelectedCell`]) {
          selectedCellsInitialState = {
            ...selectedCellsInitialState,
            [`${key}_${item?.id}`]: {
              id: item?.id,
              column: key,
              value: true
            }
          };
        }
      }
    });

    const [selectedCells, setSelectedCells] = useState<{
      [key: string]: { id: string | number; column: string; value: boolean };
    }>(selectedCellsInitialState);

    const tableColumns = useMemo(() => {
      return loading
        ? columns.map((column) => ({
          ...column,
          canSort: true,
          Cell: (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <MUISkeleton width={'100%'} />
            </Box>
          )
        }))
        : columns.map((column) => ({
          disableSortBy: column.disableSortBy || true,
          ...column
        }));
    }, [loading, selectedCells]); // ! se si mette column come dipendenza causa il rerendering

    let tableDataSelected = [];
    data?.forEach((item) => {
      let row = { ...item };
      for (let key in item) {
        if (`${key}_${item?.id}` in selectedCells || {}) {
          row = {
            ...row,
            [`${key}SelectedCell`]: selectedCells[`${key}_${item?.id}`]?.value
          };
        }
      }
      tableDataSelected.push(row);
    });

    const tableData = useMemo(() => {
      if (error) return [];
      if (loading) return Array(prevData?.length || skeletonRows).fill({});

      return tableDataSelected || [];
    }, [data, error, loading, prevData, skeletonRows, selectedCells]);

    const getColumnHeaderChecked = (columnName: string) => {
      let count = 0;
      for (let key in selectedCells) {
        count +=
          selectedCells[key]?.column === columnName && selectedCells[key]?.value
            ? 1
            : 0;
      }
      return count === data?.length;
    };

    // Da la possibilità di abilitare in maniera dinamica la selezione delle celle
    useEffect(() => {
      let newSelectedCells = {};
      data?.forEach((item) => {
        for (let key in item) {
          if (item[`${key}SelectedCell`]) {
            newSelectedCells = {
              ...newSelectedCells,
              [`${key}_${item?.id}`]: {
                id: item?.id,
                column: key,
                value: true
              }
            };
          }
        }
      });
      setSelectedCells(newSelectedCells);
    }, [selectable]);

    const getColumnHeaderIndeterminate = (columnName: string) => {
      let countTrue = 0;
      let countFalse = 0;
      for (let key in selectedCells) {
        countTrue +=
          selectedCells[key]?.column === columnName && selectedCells[key]?.value
            ? 1
            : 0;
        countFalse +=
          selectedCells[key]?.column === columnName &&
            !selectedCells[key]?.value
            ? 1
            : 0;
      }
      return (
        countTrue + countFalse === data?.length &&
        countTrue > 0 &&
        countFalse > 0
      );
    };

    // Generate an object with rows index and default expanded state
    // {0; true, 1: true} to expand by default first 2 rows
    const initialExpandedState = useMemo(() => {
      return {
        expanded: (data || [])?.reduce(
          (acc, curr, index) => ((acc[index] = defaultExpanded), acc),
          {}
        )
      };
    }, [data]);

    const {
      getTableProps,
      getTableBodyProps,
      prepareRow,
      toggleRowExpanded,
      toggleAllRowsSelected,
      headerGroups,
      rows,
      state: { sortBy, selectedRowIds }
    } = useTable<any>(
      {
        columns: tableColumns,
        data: tableData,
        defaultColumn,
        autoResetExpanded: false,
        manualSortBy: true,
        autoResetSelectedRows: false,
        initialState: {
          expanded: initialExpandedState?.expanded,
          sortBy: defaultSort ? defaultSort : []
        }
      },
      useSortBy,
      useExpanded,
      useFlexLayout,
      useRowSelect,
      useSticky,
      (hooks: any) => {
        if (expandable) {
          hooks.visibleColumns.push((columns: any) => [
            {
              id: 'expander',
              width: 40,
              Header: () => null,
              Cell: ({ row }) =>
                row.canExpand ? (
                  <span
                    {...row.getToggleRowExpandedProps({
                      style: {
                        paddingLeft: `${row.depth * 2}rem`
                      }
                    })}
                  >
                    <span
                      tabIndex={0}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '10px',
                        color: 'rgba(0, 0, 0, 0.54)'
                      }}
                    >
                      {row.isExpanded ? (
                        <ExpandMoreIcon />
                      ) : (
                        <ChevronRightIcon />
                      )}
                    </span>
                  </span>
                ) : row?.depth > 0 ? (
                  { expandedRowLeftIcon }
                ) : null
            },
            ...columns
          ]);
        }
        if (selectable) {
          hooks.visibleColumns.push((columns: any) => [
            {
              id: 'selection',
              width: 40,
              Header: ({ getToggleAllRowsSelectedProps }) =>
                multiSelectable ? (
                  <Checkbox label={''} {...getToggleAllRowsSelectedProps()} />
                ) : null,
              Cell: ({ row }) => (
                <Checkbox
                  label={''}
                  {...row.getToggleRowSelectedProps()}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!multiSelectable) {
                      toggleAllRowsSelected(false);
                      row.toggleRowSelected(true);
                    } else {
                      row.toggleRowSelected(!row.isSelected);
                    }
                  }}
                />
              )
            },
            ...columns
          ]);
        }
        hooks.visibleColumns.push((columns: any[]) => {
          let selectableColumns = [];
          columns.forEach((column, index) => {
            if (column?.Filter) {
              selectableColumns = [
                ...selectableColumns,
                {
                  id: `selection_${index}`,
                  width: 40,
                  Header: () => (
                    <Checkbox
                      label=""
                      onChange={(event, value) => {
                        let state = {};
                        data?.forEach((item) => {
                          state = {
                            ...state,
                            [`${column?.id}_${item?.id}`]: {
                              id: item?.id,
                              column: column?.id,
                              value
                            }
                          };
                        });
                        setSelectedCells((prevState) => ({
                          ...prevState,
                          ...state
                        }));
                      }}
                      checked={getColumnHeaderChecked(column?.id)}
                      indeterminate={getColumnHeaderIndeterminate(column?.id)}
                    />
                  ),
                  Cell: ({ row }) => {
                    return (
                      <Checkbox
                        label=""
                        onChange={(event, value) => {
                          setSelectedCells((prevState) => ({
                            ...prevState,
                            [`${column?.id}_${row?.original?.id}`]: {
                              id: row?.original?.id,
                              column: column?.id,
                              value
                            }
                          }));
                        }}
                        checked={
                          selectedCells[`${column?.id}_${row?.original?.id}`]
                            ?.value
                        }
                      />
                    );
                  }
                },
                column
              ];
            } else {
              selectableColumns = [...selectableColumns, column];
            }
          });
          return selectableColumns;
        });
      }
    ) as TableInstance<any>

    useEffect(() => {
      if (onSort) onSort(sortBy);
    }, [sortBy]);

    useEffect(() => {
      const selectedIds = Object.keys(selectedRowIds);
      const selectedRowsData = selectedIds
        .map((x) => data[x])
        .filter(function (x) {
          return x != null;
        });

      if (onSelectRow) onSelectRow(selectedRowsData);
    }, [selectedRowIds]);

    useEffect(() => {
      if (onCellsSelected) onCellsSelected(selectedCells);
    }, [selectedCells]);

    useImperativeHandle(ref, () => ({
      expandSubrows(subrowsIds: string[]) {
        subrowsIds.forEach((item) => toggleRowExpanded([item], true));
      },
      collapseubrows(subrowsIds: string[]) {
        subrowsIds.forEach((item) => toggleRowExpanded([item], false));
      },
      clearSelectedRows() {
        toggleAllRowsSelected(false);
      }
    }));

    return (
      <MUITableContainer>
        <StyledTable {...getTableProps} {...props}>
          {!error && rows.length > 0 && !hideHead && (
            <TableHead headerGroups={headerGroups} />
          )}
          {!error && (
            <TableBody
              rows={rows}
              prepareRow={prepareRow}
              subRowComponent={subRowComponent}
              emptyTableText={emptyTableText}
              emptyTableSubText={emptyTableSubText}
              emptyTableButton={emptyTableButton}
              onRowClick={onRowClick}
              {...getTableBodyProps}
            />
          )}
        </StyledTable>
      </MUITableContainer>
    );
  }
);

export default Table;
