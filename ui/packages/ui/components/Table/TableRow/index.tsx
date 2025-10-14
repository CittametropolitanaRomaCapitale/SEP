import { FCC } from '@cmrc/types/FCC';
import type { TableRowProps as MUITableRowProps } from '@mui/material';

import MUITableRow from '@mui/material/TableRow';
import { styled } from '@mui/material';

const StyledMUITableRow = styled(MUITableRow)(({ theme }) => ({
  borderBottom: `1px solid ${
    theme.palette.mode === 'light' ? '#E6E8F0' : '#303030'
  }`,
  '&:hover': {
    backgroundColor: ` ${
      theme.palette.mode === 'light' ? '#E6E8F0' : '#303030'
    }`
  }
}));

const TableRow: FCC<MUITableRowProps> = ({ children, ...props }) => {
  return <StyledMUITableRow {...props}>{children}</StyledMUITableRow>;
};

export default TableRow;
