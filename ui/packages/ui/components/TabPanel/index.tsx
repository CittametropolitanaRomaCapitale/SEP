import { FCC } from '@cmrc/types/FCC';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface TabPanelProps {
  index: string;
  value: string;
}

const TabPanel: FCC<TabPanelProps> = ({ index, value, children, ...props }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...props}
    >
      {value === index && (
        <Box>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default TabPanel;
