import { useState } from "react";
import Dialog from "@cmrc/ui/components/Dialog";
import { Box, Grid } from "@mui/material";
import { useDialog } from "../../../../../store/dialog/useDialog";
import { EmailForm } from "./EmailForm";

export const EmailFormDialog = () => {
  const [fullScreenMode, setFullScreenMode] = useState(false); // TODO: da implementare 
  const { isOpen, close:closeDialog } = useDialog({
    dialog_id: 'dialogEmailForm'
  });

  return (
    <Box>
      <Grid>
        <Dialog fullScreen={fullScreenMode} open={isOpen} onClose={closeDialog} >
          <EmailForm/>
        </Dialog>
      </Grid>
    </Box>
  )
}

