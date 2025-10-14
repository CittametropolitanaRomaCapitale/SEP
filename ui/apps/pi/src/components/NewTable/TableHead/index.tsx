import { FCC } from '@cmrc/types/FCC';
import { type TableHeadProps as MUITableHeadProps } from '@mui/material';
import { flexRender } from '@tanstack/react-table';
import MUITableHead from '@mui/material/TableHead';
import MUITableRow from '@mui/material/TableRow';
import MUITableCell from '@mui/material/TableCell';
import MUIUnfoldMore from '@mui/icons-material/UnfoldMore';
import MUIExpandLess from '@mui/icons-material/ExpandLess';
import MUIExpandMore from '@mui/icons-material/ExpandMore';
import styled from '@emotion/styled';

export type TableHeadProps = {
  headerGroups: any[];
} & MUITableHeadProps;

const StyledTableHead = styled(MUITableHead)(() => ({
  backgroundColor: 'white',
  borderBottom: '1px solid #E6E8F0'
}));


const getSortIcon = (column) => {
  if (!column.getCanSort()) {
    return null;
  }

  const sortDirection = column.getIsSorted();

  if (!sortDirection) {
    return <MUIUnfoldMore style={{ color: '#ccc' }} />;
  }

  if (sortDirection === 'desc') {
    return <MUIExpandLess style={{ color: '#ccc' }} />;
  }

  return <MUIExpandMore style={{ color: '#ccc' }} />;
};

const TableHead: FCC<TableHeadProps> = ({ headerGroups, ...props }) => (
  <StyledTableHead {...props}>
    {headerGroups.map((headerGroup) => (
      <MUITableRow
        key={headerGroup.id}
      >
        {headerGroup.headers.map((header) => (
          <MUITableCell
            key={header.id}
            colSpan={header.colSpan}
            align={header.column.isNumeric ? 'right' : 'left'}
            sx={{
              display: 'table-cell',
              width: header.getSize(),
              '&[data-sticky-td]': {
                backgroundColor: 'white',
              }
            }}
            onClick={header.column.getToggleSortingHandler()}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '29px',
                cursor: header.column.getCanSort() ? 'pointer' : 'default'
              }}
            >
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}

              {getSortIcon(header.column)}
            </span>
          </MUITableCell>
        ))}
      </MUITableRow>
    ))}
  </StyledTableHead>
);

export default TableHead;