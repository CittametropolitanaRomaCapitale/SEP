import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { ListItemIcon } from '@mui/material';

export const CronologiaInnerCard: FC<{
  recordLabel: string;
  record?: string;
  value?: string;
  icon?: JSX.Element;
}> = ({ record, recordLabel, icon, value }) => (
  <ListItem>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText
      primary={
        <>
          {value && (
            <Typography
              sx={{ display: 'inline', marginRight: '5px' }}
              component="span"
              variant="body2"
              fontWeight="bold"
            >
              {value}
            </Typography>
          )}
          <Typography
            sx={{ display: 'inline', marginRight: '5px' }}
            component="span"
            variant="body2"
            fontWeight="500"
          >
            {recordLabel}
          </Typography>
          <Typography
            sx={{ display: 'inline' }}
            component="span"
            variant="body2"
            fontWeight="bold"
          >
            {record}
          </Typography>
        </>
      }
    />
  </ListItem>
);
