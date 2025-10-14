import { Fragment } from 'react';
import TableRow from '../TableRow';
import TableCell from '../TableCell';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material';
import { FCC } from '@cmrc/types/FCC';

export interface TableEmptyProps {
  emptyTableText?: string;
  emptyTableSubText?: string;
  emptyTableButton?: JSX.Element;
}

const StyledTableRow = styled(TableRow)(({}) => ({
  '&:hover': {
    backgroundColor: '#FFFFFF'
  }
}));

const TableEmpty: FCC<TableEmptyProps> = ({
  emptyTableText,
  emptyTableSubText,
  emptyTableButton,
  ...props
}) => {
  return (
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
  );
};

export default TableEmpty;
