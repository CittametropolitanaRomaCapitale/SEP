import { FCC } from '@cmrc/types/FCC';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/system';

export interface TooltipEllipsisLabelProps {
  label?: string;
  title?: string;
  sx?: SxProps;
}

const TooltipEllipsisLabel: FCC<TooltipEllipsisLabelProps> = ({
  label,
  title,
  sx
}) => (
  <Tooltip title={title || label}>
    <Typography
      variant="inherit"
      sx={{
        margin: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        ...sx
      }}
    >
      {label}
    </Typography>
  </Tooltip>
);
export default TooltipEllipsisLabel;
