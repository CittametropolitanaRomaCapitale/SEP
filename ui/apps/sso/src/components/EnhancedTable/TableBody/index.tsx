import { Fragment } from 'react';
import { FCC } from '@cmrc/types/FCC';
import MUITableBody from '@mui/material/TableBody';
import MUITableRow from '@mui/material/TableRow';
import MUITableCell from '@mui/material/TableCell';
import { flexRender } from '@tanstack/react-table';
import { type TableBodyProps as MUITableBodyProps } from '@mui/material';

export type TableBodyProps = {
  rows: any[];
  onRowClick?: (row: any) => void;
} & MUITableBodyProps;

// TODO: da implementare in se sarà necessario 
// const getBackgroundColor = (row) => {
//   if (row.getIsExpanded() && row.getCanExpand()) {
//     return '#E6E8F0';
//   }
//   if (row?.original?.highlightedRow) {
//     return '#FFFFDC';
//   }
//   return 'white';
// };

const TableBody: FCC<TableBodyProps> = ({
  rows,
  onRowClick,
  ...props
}) => (
  <MUITableBody {...props}>
    {rows.map((row) => (
      <Fragment key={row.id}>
        <MUITableRow
          onClick={() => onRowClick?.(row)}
          sx={{
            borderLeft: row.depth > 0 ? '5px solid rgba(0,0,0, 0.54)' : 'none',
            borderRight: '1px',
            // backgroundColor: getBackgroundColor(row),
            ':hover': {
            backgroundColor: '#DCDCDC',
            cursor: onRowClick ? 'pointer' : 'default'
          },
          }}
        >
          {row.getVisibleCells().map((cell) => (
            <MUITableCell
              key={cell.id}
              sx={{
                width: cell.column.getSize(),
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </MUITableCell>
          ))}
        </MUITableRow>
      </Fragment>
    ))}
  </MUITableBody>
);

export default TableBody;