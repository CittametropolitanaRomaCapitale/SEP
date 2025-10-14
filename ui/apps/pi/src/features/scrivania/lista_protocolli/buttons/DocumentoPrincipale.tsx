import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton"
import Grid from "@mui/material/Grid"
import Tooltip from "@mui/material/Tooltip";
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { FCC } from "@cmrc/types/FCC";
import { Allegato } from "@cmrc/services/src/app/piapi/generated";
import { useHTTPRequests } from "../../../../utils/network_utilities";

export type DocumentoPrincipaleProps = {
  allegato?: Allegato
}

export const DocumentoPrincipale: FCC<DocumentoPrincipaleProps> = ({ allegato }) => {
  const [onDownload, setDownload] = useState(false)
  const { downloadRequest } = useHTTPRequests();

  const downloadDocumento = async () => {
    setDownload(true);
    downloadRequest({
      url: `${process.env.NEXT_PUBLIC_API_URL}/allegato/download/${allegato?.id}`,
      filename: allegato?.nome
    }).finally(() => setDownload(false));
  };

  return (
    allegato &&
    <Grid
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'right'
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <Tooltip title={allegato?.nome}>
        <LoadingButton
          aria-label="download"
          onClick={downloadDocumento}
          loading={onDownload}
          size="small"
          sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        >
          <FileOpenIcon />
        </LoadingButton>
      </Tooltip>
    </Grid>
  )
}