import React, { useState } from 'react';
import { FCC } from '@cmrc/types/FCC';
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { EmailBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEmailActionsList } from './hooks/useEmailActionsList';
import { useGoToProtocollo } from './hooks/useGoToProtocollo';
import { dictionary } from './dictionary';
import { useDialog } from '../../../../store/dialog/useDialog';
import { useRispondiConProtocollo } from './hooks/useRispondiConProtocollo';
import { useDispatch } from '../../../../store';
import {
  setEmailData,
  setinoltraRispondi
} from '../../../../store/email/emailSlice';
import { useProtocollaEmail } from './hooks/useProtocollaEmail';
import { useInoltraConProtocollo } from './hooks/useInoltraConProtocollo';
import { StoricoProtocolloLayout } from '../../../protocollo/storicizzazione/layouts/StoricoProtocolloLayout';
import FullScreenDialog from '@cmrc/ui/components/FullScreenDialog';
import { useDownloadAllegati } from './hooks/useDownloadAllegati';

type EmailActionListProp = {
  emailData: EmailBaseFragment;
  cdr: string;
  cdrCode: string;
};

const EmailActionsList: FCC<EmailActionListProp> = ({
  emailData,
  cdr,
  cdrCode
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: boolean;
  }>({});
  const { getActions } = useEmailActionsList();
  const { goToProtocollo } = useGoToProtocollo();
  const { protocolla } = useProtocollaEmail();
  const { rispondiConProtocollo } = useRispondiConProtocollo();
  const { inoltraConProtocollo } = useInoltraConProtocollo();
  const actionsList = getActions(emailData);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const { open: openEmailFormDialog } = useDialog({
    dialog_id: 'dialogEmailForm'
  });
  const { downloadAllegati } = useDownloadAllegati();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickAction = async (action: string) => {
    setLoadingActions((prev) => ({ ...prev, [action]: true }));
    try {
      switch (action) {
        // VAI AL PROTOCOLLO
        case dictionary.get('goToProtocollo'):
          await goToProtocollo(emailData);
          break;
        // DOWNLOAD ALLEGATI PROTOCOLLO
        case dictionary.get('downloadAllegatiProtocollo'):
          await downloadAllegati(emailData);
          break;
        // RISPONDI VIA PEC/PEO
        case dictionary.get('rispondiPecPeo'):
          dispatch(setEmailData(emailData));
          dispatch(setinoltraRispondi(dictionary.get('actionRispondi')));
          openEmailFormDialog();
          break;

        // INOLTRA VIA PEC/PEO
        case dictionary.get('inoltraPecPeo'):
          dispatch(setEmailData(emailData));
          dispatch(setinoltraRispondi(dictionary.get('actioniInoltra')));
          openEmailFormDialog();
          break;

        // RISPONDI CON PROTOCOLLO
        case dictionary.get('rispondiConProtocollo'):
          await rispondiConProtocollo(emailData);
          break;

        // INOLTRA CON PROTOCOLLO
        case dictionary.get('inoltraConProtocollo'):
          await inoltraConProtocollo(emailData);
          break;

        // PROTOCOLLA
        case dictionary.get('protocolla'):
          await protocolla(emailData);
          break;

        case dictionary.get('storico'):
          openStoricoDialog();
          break;

        default:
          break;
      }
    } finally {
      setLoadingActions((prev) => ({ ...prev, [action]: false }));
      handleClose();
    }
  };

  const {
    open: openStoricoDialog,
    isOpen: isOpenStorico,
    close: closeStoricoDialog
  } = useDialog({
    dialog_id: `dialogStorico${emailData?.protocollo?.id}`
  });

  return (
    <Box sx={{ textAlign: 'right' }}>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {actionsList.map((action) => (
          <MenuItem
            key={action}
            onClick={() => handleClickAction(action)}
            disabled={loadingActions[action]}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <Typography variant="inherit">{action}</Typography>
              {loadingActions[action] && (
                <CircularProgress size={16} style={{ marginLeft: 10 }} />
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
      <FullScreenDialog
        title={dictionary.get('storico')}
        open={isOpenStorico}
        onClose={closeStoricoDialog}
        contrastBackground
      >
        <StoricoProtocolloLayout
          protocolloData={emailData?.protocollo}
          cdr={cdr}
          cdrCode={cdrCode}
        />
      </FullScreenDialog>
    </Box>
  );
};

export default EmailActionsList;
