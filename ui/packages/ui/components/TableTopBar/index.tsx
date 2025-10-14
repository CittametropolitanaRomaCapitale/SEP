import { FCC } from '@cmrc/types/FCC';
import { SxProps } from '@mui/material';
import { Theme } from '@mui/material';
import Grid from '@mui/material/Grid';

export type TableTopBarProps = {
  leftElement?: JSX.Element;
  rightElement?: JSX.Element;
  sx?: SxProps<Theme>;
};

const TableTopBar: FCC<TableTopBarProps> = ({
  leftElement,
  rightElement,
  sx
}) => {
  return (
    <Grid
      container
      justifyContent="space-between"
      sx={{
        mb: 1,
        padding: 2,
        borderBottom: '3px solid #F9FAFC',
        ...sx
      }}
    >
      <Grid
        flex="1"
        item
        sx={{
          lineHeight: '36px'
        }}
      >
        {leftElement && leftElement}
      </Grid>
      <Grid item>{rightElement && rightElement}</Grid>
    </Grid>
  );
};

export default TableTopBar;
