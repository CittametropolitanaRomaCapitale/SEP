import { FCC } from '@cmrc/types/FCC';
import { TableCellProps as MUITableCellProps } from '@mui/material';
import MUITableCell from '@mui/material/TableCell';
import { styled } from '@mui/material';

const StyledMUITableCell = styled(MUITableCell)(({}) => ({
  borderBottom: 'none',
  fontSize: '12px',
  padding: '10px 16px',
  verticalAlign: 'middle',
  '&[data-sticky-td]': {
    backgroundColor: 'white'
  }
}));

const TableCell: FCC<MUITableCellProps> = ({ children, ...props }) => {
  return <StyledMUITableCell {...props}>{children}</StyledMUITableCell>;
};

export default TableCell;
