import { FCC } from "@cmrc/types/FCC"
import { AppBar, AppBarProps, IconButton, Toolbar } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

export type AppBarCustomProps = AppBarProps & {
  close:() => void;
}

export const MuiAppBar: FCC<AppBarCustomProps> = ({ close }) => (
  <AppBar sx={{ position: 'relative' }}>
  <Toolbar>
    <IconButton
      edge="start"
      color="inherit"
      onClick={close}
      aria-label="close"
    >
      <CloseIcon />
    </IconButton>
  </Toolbar>
  </AppBar>
  )