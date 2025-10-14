import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import UploadButton from '../UploadButton';

export interface AllegatiProps {
  inputKey: string;
  label?: string;
  title?: string;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'medium' | 'small';
  onUpload?: (data?: any) => void;
  attachment?: { id: number; delegation_id: number; url: string };
  onUploadAllegato?: (data?: any) => void;
  onDownloadAllegato?: (data?: any) => void;
  onDeleteAllegato?: (data?: any) => void;
  fileToUpload?: any;
}

export const Allegati: FC<AllegatiProps> = ({
  inputKey,
  label,
  disabled,
  variant = 'contained',
  size = 'small',
  onUpload,
  title,
  attachment,
  onUploadAllegato,
  onDownloadAllegato,
  onDeleteAllegato,
  fileToUpload
}) => (
  <Grid container direction="column" rowSpacing={3}>
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{
        mb: 2,
        mt: 2
      }}
    >
      <Grid
        flex="1"
        item
        sx={{
          lineHeight: '36px'
        }}
      >
        <Typography sx={{ textTransform: 'uppercase' }}>{title}</Typography>
      </Grid>
      <Grid item>
        <UploadButton
          inputKey={inputKey}
          disabled={disabled}
          startIcon={<UploadIcon />}
          label={label}
          size={size}
          variant={variant}
          onUpload={onUpload}
          onUploadAllegato={onUploadAllegato}
        />
      </Grid>
    </Grid>
    {fileToUpload && (
      <Alert
        severity="info"
        variant="standard"
        icon={false}
        sx={{ maringTop: 1, marginBottom: 4 }}
      >
        Al salvataggio verrà caricato il file:
        <ListItem>
          <ListItemText
            primary={fileToUpload.name}
            primaryTypographyProps={{
              color: '',
              fontWeight: 'bold',
              variant: 'body2'
            }}
          />
        </ListItem>
      </Alert>
    )}
    {attachment && (
      <ListItem
        sx={{ padding: 0, maringTop: 1, marginBottom: 4 }}
        secondaryAction={
          <Box sx={{ display: 'flex' }}>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDownloadAllegato(attachment.id)}
            >
              <DownloadIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDeleteAllegato({ allegatoToDelete: attachment })}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        }
      >
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText primary={attachment.url} />
      </ListItem>
    )}
  </Grid>
);
