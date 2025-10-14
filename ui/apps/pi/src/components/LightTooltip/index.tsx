import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";

interface LightTooltipProps extends TooltipProps {
  customWidth?: number | string;
}

export const LightTooltip = styled(({ className, customWidth, ...props }: LightTooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme, customWidth }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.contrastText,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[10],
    fontSize: 11,
    maxWidth: customWidth 
  }
}));