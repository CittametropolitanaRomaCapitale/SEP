import { useOffice } from "@cmrc/auth/useOffice";
import { FCC } from "@cmrc/types/FCC";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type DashboardLayoutTitleProps = {
  sezione: string;
}

export const DashboardLayoutTitle: FCC<DashboardLayoutTitleProps> = ({sezione}) => {
  const { cdr, shortCdrDesc } = useOffice();
  const title = `${sezione}\u00A0\u00A0\u00A0|\u00A0\u00A0\u00A0`;

  return (
    <Box display="flex" alignItems="center" >
      <Typography variant="inherit" component="span">
        {title} 
      </Typography>
      <Box display="flex" flexDirection="column">
        <Typography variant="subtitle2" color="span">
          {`${cdr} - ` || ""} {shortCdrDesc || ""}
        </Typography>
      </Box>
    </Box >
  )
}