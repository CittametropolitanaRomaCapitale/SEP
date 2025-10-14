import { useState } from "react";
import { FCC } from "@cmrc/types/FCC";
import { RegistroGiornaliero } from "@cmrc/services/src/app/piapi/generated";
import Box from "@mui/material/Box"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import FullScreenDialog from "@cmrc/ui/components/FullScreenDialog";
import { ScaricaRegistroGiornalieroButton } from "./buttons/ScaricaRegistroGiornalieroButton";
import { dictionary } from "./dictionary";
import { useDialog } from "../../../store/dialog/useDialog";
import { LayoutStoricoRegistroProtocollo } from "./storico/layouts/LayoutStoricoRegistroGiornaliero";

export type RegistroGiornalieroActionsProps = {
  registroGiornaliero: RegistroGiornaliero;
}

export const RegistroGiornalieroActions: FCC<RegistroGiornalieroActionsProps> = ({ registroGiornaliero }) => {
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});

  const actionsList = [];
  actionsList.push(dictionary.get('visualizzaStorico'));

  const { open: openRegistroProtocolloDialog, isOpen, close } = useDialog({
    dialog_id: `dialogStoricoRegistroGiornaliero${registroGiornaliero?.id}`
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAction = (action: string) => {
    switch (action) {
      case dictionary.get('visualizzaStorico'):
        openRegistroProtocolloDialog();
        break;
      default: break;
    }
    setAnchorEl(null);
  }

  const handleClickAction = (action: string) => {
    setLoadingActions((prev) => ({ ...prev, [action]: true }));
    handleAction(action);
    setLoadingActions((prev) => ({ ...prev, [action]: false }));
  }

  const onOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ScaricaRegistroGiornalieroButton registroGiornaliero={registroGiornaliero} />
        <IconButton onClick={(event) => onOpen(event)}>
          <MoreVertIcon />
        </IconButton><Menu
          id="actions-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={onClose}
        >
          {actionsList.map((action) => (
            <MenuItem
              key={action}
              onClick={() => handleClickAction(action)}
              disabled={loadingActions[action]}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="inherit">{action}</Typography>
                {loadingActions[action] && (
                  <CircularProgress size={16} style={{ marginLeft: 10 }} />
                )}
              </Box>
            </MenuItem>
          ))}
        </Menu>
      <FullScreenDialog
        title={`${dictionary.get('storico')} - Registro giornaliero: ${registroGiornaliero?.file}`}
        open={isOpen}
        onClose={close}
        contrastBackground
      >
        <LayoutStoricoRegistroProtocollo itemSelected={registroGiornaliero} />
      </FullScreenDialog>
    </>
  )
}