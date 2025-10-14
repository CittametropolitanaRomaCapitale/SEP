import { FCC } from "@cmrc/types/FCC";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Slide, { SlideProps } from '@mui/material/Slide';
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from "@mui/material/Card";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useSnackbar } from "../../store/snackbar/useSnackBar";
import { SnackbarMessage } from "../../store/snackbar/snackbarSlice";

const SlideTransition = (props: SlideProps) => <Slide {...props} direction="up" />

export type SnackBarProps = {
  snackBarId: string;
  title: string;
  message?: string;
  vertical: 'bottom' | 'top';
  horizontal: 'left' | 'center' | 'right';
  listMessageDescription?: string;
  isListMessage?: boolean;
  leftIcon?: React.ReactNode;
  deleteIcon?: boolean;
}

export const SnackBar: FCC<SnackBarProps> = ({
  snackBarId,
  title,
  listMessageDescription,
  leftIcon,
  deleteIcon,
  isListMessage = false,
  horizontal,
  vertical
}) => {

  const { isOpen, currentMessage, currentMessageQueue, close } = useSnackbar({
    snackBarId
  });

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    close();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={isOpen}
      TransitionComponent={SlideTransition}
      onClose={handleClose}
      key={vertical + horizontal}
      sx={{
        animation: 'moveUpDown 2s ease-in-out infinite',
        '@keyframes moveUpDown': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-2px)',
          },
        },
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <Card sx={{ padding: 0, maxWidth: '400px' }}>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            justifyContent: 'space-between',
            padding: 1,
            borderRadius: '4px 4px 0 0',
          }}
        >
          <Typography >{title}</Typography>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box>
          {!isListMessage ?
            (
              <ListItem >
                <ListItemIcon >
                  {leftIcon}
                </ListItemIcon>
                <ListItemText primary={currentMessage} />
              </ListItem>
            )
            :
            (
              <List dense>
                {currentMessageQueue?.slice(0, 10).map((item: SnackbarMessage) => (
                  <ListItem secondaryAction={
                    currentMessageQueue?.length > 1 && deleteIcon &&
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  } >
                    <ListItemIcon >
                      {leftIcon}
                    </ListItemIcon>
                    <ListItemText primary={item.message}
                    />
                  </ListItem>
                ))}
                {currentMessageQueue?.length > 10 && (
                  <ListItem>
                    <ListItemText primary={`Più ${currentMessageQueue.length - 10} ${listMessageDescription}`} />
                  </ListItem>
                )}
              </List>
            )
          }
        </Box>
      </Card>
    </Snackbar >
  );
}