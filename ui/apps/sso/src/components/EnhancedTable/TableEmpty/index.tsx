import { FCC } from '@cmrc/types/FCC';
import MUITableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableRow from '@cmrc/ui/components/Table/TableRow';
import { styled } from '@mui/material';
import { Fragment } from 'react';
import TableCell from '@cmrc/ui/components/Table/TableCell';
import Stack from '@mui/system/Stack';

export interface TableEmptyProps {
  emptyTableText?: string;
  emptyTableSubText?: string;
  emptyTableButton?: JSX.Element;
}

const StyledTableRow = styled(TableRow)(() => ({
  '&:hover': {
    backgroundColor: '#FFFFFF'
  }
}));

const TableEmpty: FCC<TableEmptyProps> = ({
  emptyTableText = 'Nessun dato disponibile',
  emptyTableSubText,
  emptyTableButton,
  ...props
}) => (
  <MUITableBody {...props}>
    <Fragment key={`table_row_${0}`}>
      <StyledTableRow {...props} key={`tr_${0}`} sx={{ borderBottom: 'none' }}>
        <TableCell
          sx={{
            textAlign: 'center',
            paddingBottom: 1.2,
            flexFlow: 'column'
          }}
          key={`td_${0}`}
        >
          <Stack spacing={2} sx={{ display: 'block', p: 2 }}>
            <Typography variant="h6">{emptyTableText}</Typography>
            <Typography variant="subtitle2">{emptyTableSubText}</Typography>
            {emptyTableButton}
          </Stack>
        </TableCell>
      </StyledTableRow>
    </Fragment>
  </MUITableBody>
);

export default TableEmpty;