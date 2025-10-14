import { Fragment, cloneElement } from 'react';
import type { TableBodyProps as MUITableBodyProps } from '@mui/material';

import MUITableBody from '@mui/material/TableBody';
import TableRow from '../TableRow';
import TableCell from '../TableCell';
import TableEmpty from '../TableEmpty';
import { FCC } from '@cmrc/types/FCC';

export type TableBodyProps = {
  rows?: any;
  prepareRow?: any;
  actions?: any[];
  subRowComponent?: JSX.Element;
  emptyTableText?: string;
  emptyTableSubText?: string;
  emptyTableButton?: JSX.Element;
  onRowClick?: any;
} & MUITableBodyProps;

const TableBody: FCC<TableBodyProps> = ({
  rows,
  prepareRow,
  subRowComponent,
  emptyTableText,
  emptyTableSubText,
  emptyTableButton,
  onRowClick,
  ...props
}) => {
  return (
    <MUITableBody {...props}>
      {rows.length > 0 &&
        rows.map((row: any, trIndex: number) => {
          prepareRow(row);
          const { getRowProps, style, ...rowProps } = row.getRowProps({
            onClick: () => {
              if (onRowClick) onRowClick(row);
            }
          });
          const keyId = row?.original?.id || trIndex;
          return (
            <Fragment key={`table_row_${keyId}`}>
              <TableRow
                aria-label={`table_row_${keyId}`}
                key={`tr_${keyId}`}
                {...getRowProps}
                {...rowProps}
                sx={{
                  ...style,
                  backgroundColor:
                    row.isExpanded && row.canExpand
                      ? '#E6E8F0'
                      : row?.original?.highlightedRow
                      ? '#FFFFDC'
                      : 'white',
                  ':hover': {
                    backgroundColor: row?.original?.highlightedRow
                      ? '#F5DF8C'
                      : '#DCDCDC'
                  },
                  borderLeft:
                    row.depth > 0 ? '5px solid rgba(0,0,0, 0.54)' : 'none',
                  cursor: onRowClick ? 'pointer' : 'default'
                }}
              >
                {(row.depth == 0 && subRowComponent) || !subRowComponent
                  ? row.cells.map((cell: any, tdIndex: number) => (
                      <TableCell align="left" key={`td_${tdIndex}`} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))
                  : subRowComponent
                  ? cloneElement(subRowComponent, {
                      key: `tr_subrow_${keyId}_${row?.original?.id || row?.id}`,
                      parent: rows?.find(
                        (item) =>
                          item?.id ===
                          row?.id?.split('.').slice(0, -1).join('.')
                      ),
                      row: row
                    })
                  : null}
              </TableRow>
            </Fragment>
          );
        })}
      {rows.length == 0 && (
        <TableEmpty
          emptyTableText={emptyTableText}
          emptyTableSubText={emptyTableSubText}
          emptyTableButton={emptyTableButton}
        />
      )}
    </MUITableBody>
  );
};

export default TableBody;
