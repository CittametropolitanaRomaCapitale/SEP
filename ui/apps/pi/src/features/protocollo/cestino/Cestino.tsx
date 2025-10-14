import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Grid,
  Typography
} from '@mui/material';
import { Dialog } from '@cmrc/ui/components/Dialog';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { AllegatoDownloadStatuses } from '../../../utils/types';
import { AllegatoTable } from '../allegati/hooks/useAllegatiService';
import { CestinoTable } from './CestinoTable';
import { dictionary } from './dictionary';
import { useHTTPRequests } from '../../../utils/network_utilities';
import toast from '@cmrc/ui/components/Toast';
import { useDialog } from '../../../store/dialog/useDialog';
import { EmailPreview } from '../allegati/EmailPreview';

interface CestinoProps {
  onHandleResumeFile: (file: AllegatoTable) => void;
  discardedAllegati: any[];
}

export const Cestino: React.FC<CestinoProps> = ({
  onHandleResumeFile,
  discardedAllegati
}) => {
  const [expanded, setExpanded] = useState(true);
  const [allegati, setAllegati] = useState(discardedAllegati);
  const { downloadRequest, getRequest } = useHTTPRequests();
  const [email, setEmail] = useState();
  const [filenameEml, setFilenameEml] = useState('');
  const { open, close, isOpen } = useDialog({
    dialog_id: 'dialogEmailPreviewCestino'
  });

  useEffect(() => {
    setAllegati(discardedAllegati);
  }, [discardedAllegati]);

  const handleChangeAccordion = () => {
    setExpanded(!expanded);
  };

  const handleDownloadFile = (file: AllegatoTable) => {
    const newFileAllegati = discardedAllegati.map((fileInside) => {
      if (fileInside.id === file.id) {
        return {
          ...fileInside,
          downloadStatus: AllegatoDownloadStatuses.DOWNLOADING
        };
      }
      return fileInside;
    });
    setAllegati(newFileAllegati);
    const downloadUrl = `allegato/download/${file.id}`;
    downloadRequest({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${downloadUrl}`,
      filename: file.nome,
      forceDownload: true,
      callback: (data) => {
        let newDownloadStatus = AllegatoDownloadStatuses.ERROR;
        if (data.ok) {
          newDownloadStatus = AllegatoDownloadStatuses.READY;
        }
        const updatedAllegati = newFileAllegati.map((allegatoInside) => {
          if (allegatoInside.id === file.id) {
            allegatoInside.downloadStatus = newDownloadStatus;
          }
          return allegatoInside;
        });
        setAllegati(updatedAllegati);
      }
    });
  };
  const handleDownloadOriginalFile = (file: AllegatoTable) => {
    const newFileAllegati = discardedAllegati.map((fileInside) => {
      if (fileInside.idOriginal === file.idOriginal) {
        return {
          ...fileInside,
          downloadStatus: AllegatoDownloadStatuses.DOWNLOADING_ORIGINAL
        };
      }
      return fileInside;
    });
    setAllegati(newFileAllegati);
    const downloadUrl = `allegato/download/${file.idOriginal}`;
    downloadRequest({
      url: `${process.env.NEXT_PUBLIC_API_URL}/${downloadUrl}`,
      filename: file.nome,
      forceDownload: true,
      callback: (data) => {
        let newDownloadStatus = AllegatoDownloadStatuses.ERROR;
        if (data.ok) {
          newDownloadStatus = AllegatoDownloadStatuses.READY;
        }
        const updatedAllegati = newFileAllegati.map((allegatoInside) => {
          if (allegatoInside.idOriginal === file.idOriginal) {
            allegatoInside.downloadStatus = newDownloadStatus;
          }
          return allegatoInside;
        });
        setAllegati(updatedAllegati);
      }
    });
  };

  const handlePreviewEmlClicked = (file: AllegatoTable) => {
    setFilenameEml(file?.nome);
    if (file.id) {
      getRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/allegato/${file.id}`,
        (response) => {
          try {
            if (response?.data) {
              open();
              setEmail(response.data);
            } else {
              throw new Error(dictionary.get('responsePreviewKO'));
            }
          } catch (error) {
            toast.error(error.message);
            close();
          }
        }
      );
    }
  };

  return (
    <Card sx={{ marginTop: 5 }}>
      <Dialog title={filenameEml} open={isOpen} onClose={close}>
        <EmailPreview email={email} />
      </Dialog>
      <Grid
        container
        direction="column"
        rowSpacing={3}
        sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 5 }}
      >
        <Grid item sx={{ width: { xs: 1 / 1, sm: 1 / 1 } }}>
          <Accordion expanded={expanded} disableGutters>
            <AccordionSummary
              onClick={handleChangeAccordion}
              expandIcon={
                <UnfoldMoreIcon
                  sx={{ marginLeft: '5px', color: expanded ? 'white' : 'grey' }}
                />
              }
              sx={{
                backgroundColor: expanded ? 'grey' : 'background.default',
                borderRadius: '8px',
                margin: '0',
                height: '55px'
              }}
            >
              <Typography
                sx={{ color: expanded ? 'background.default' : 'primary.main' }}
              >
                {dictionary.get('cestino')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CestinoTable
                files={allegati ?? []}
                onDownloadClicked={handleDownloadFile}
                onDownloadOriginalClicked={handleDownloadOriginalFile}
                onPreviewEmlClicked={handlePreviewEmlClicked}
                onResumeFile={onHandleResumeFile}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Card>
  );
};
