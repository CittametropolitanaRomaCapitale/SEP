import { FCC } from '@cmrc/types/FCC';
import type { TableHeadProps as MUITableHeadProps } from '@mui/material';

import MUITableHead from '@mui/material/TableHead';
import MUITableRow from '@mui/material/TableRow';
import MUITableCell from '@mui/material/TableCell';
import MUIUnfoldMore from '@mui/icons-material/UnfoldMore';
import MUIExpandLess from '@mui/icons-material/ExpandLess';
import MUIExpandMore from '@mui/icons-material/ExpandMore';

import { styled } from '@mui/material';

export type TableHeadProps = {
  headerGroups?: any[];
  onSort?: any;
} & MUITableHeadProps;

const StyledTableHead = styled(MUITableHead)(({ theme }) => ({
  backgroundColor: 'white',
  borderBottom: `1px solid ${
    theme.palette.mode === 'light' ? '#E6E8F0' : '#303030'
  }`
}));

const TableHead: FCC<TableHeadProps> = ({ headerGroups, onSort, ...props }) => {
  return (
    <StyledTableHead {...props}>
      {headerGroups.map((headerGroup: any, trIndex: number) => (
        <MUITableRow
          key={`tr_${trIndex}`}
          {...headerGroup.getHeaderGroupProps()}
        >
          {headerGroup.headers.map((column: any, thIndex: number) => (
            <MUITableCell
              key={`th_${thIndex}`}
              align={column.isNumeric ? 'right' : 'left'}
              sx={{
                '&[data-sticky-td]': {
                  backgroundColor: 'white'
                }
              }}
              {...column.getHeaderProps(column.getSortByToggleProps())}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  minHeight: '29px'
                }}
              >
                {column.render('Header')}
                {column.canSort &&
                  (column.isSorted ? (
                    column.isSortedDesc ? (
                      <MUIExpandLess style={{ color: '#ccc' }} />
                    ) : (
                      <MUIExpandMore style={{ color: '#ccc' }} />
                    )
                  ) : (
                    <MUIUnfoldMore style={{ color: '#ccc' }} />
                  ))}
              </span>
            </MUITableCell>
          ))}
        </MUITableRow>
      ))}
    </StyledTableHead>
  );
};

export default TableHead;
