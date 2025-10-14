import { useState } from 'react';
import Box from '@mui/material/Box';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@cmrc/ui/components/Dialog';
import { dictionary } from '../dictionary';
import { useDialog } from '../../../../store/dialog/useDialog';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { useRevocaAssegnazione } from '../hooks/useRevocaAssegnazione';

export const AssegnatariActions = ({ referente }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const actionsList = [dictionary.get('revocaAssegnazione')];
  const { open: openRevocaDialog, close, isOpen } = useDialog({
    dialog_id: `revocaAssegnazione_${referente?.id}`,
  });

  const { loading, onRevocaAssegnazione } = useRevocaAssegnazione(referente?.id);

  const handleClickAction = (action: string) => {
    if (action === dictionary.get('revocaAssegnazione')) {
      openRevocaDialog();
    }
    setAnchorEl(null);
  };

  const onOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ textAlign: 'right' }} hidden={!referente?.revocabile}>
        <IconButton onClick={onOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu id="actions-menu" anchorEl={anchorEl} open={open} onClose={onClose}>
          {actionsList.map((action) => (
            <MenuItem
              key={action}
              onClick={() => handleClickAction(action)}
              disabled={loading}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="inherit">{action}</Typography>
                {loading && <CircularProgress size={16} style={{ marginLeft: 10 }} />}
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Dialog
        fullWidth={false}
        open={isOpen}
        onClose={close}
        title={dictionary.get('revocaAssegnazione')}
      >
        <ConfirmDialog
          message={dictionary.get('confermaRevoca')}
          cancelString={dictionary.get('annulla')}
          confirmString={dictionary.get('procedi')}
          onConfirm={onRevocaAssegnazione}
        />
      </Dialog>
    </>
  );
};
