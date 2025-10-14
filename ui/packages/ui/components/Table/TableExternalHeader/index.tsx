import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FCC } from '@cmrc/types/FCC';
import { ReactNode } from 'react';

export type TableExternalHeaderProps = {
  title?: ReactNode;
  rightElement?: JSX.Element;
};

const TableExternalHeader: FCC<TableExternalHeaderProps> = ({
  title,
  rightElement
}) => {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        padding: '5px 10px',
        marginTop: '15px',
        alignItems: 'baseline'
      }}
    >
      <Typography
        sx={{
          textTransform: 'uppercase',
          fontSize: '0.825rem',
          fontWeight: '700',
          borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex' }}>{rightElement && rightElement}</Box>
    </Stack>
  );
};

export default TableExternalHeader;
