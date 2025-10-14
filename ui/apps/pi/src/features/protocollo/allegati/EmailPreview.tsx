import React, { useState } from 'react';
import {
  Button,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Card
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { EmailBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { buildAndDownloadFile } from '../../../utils/files_utilities';
import { useEmlBuilder } from './hooks/useEmlBuilder';
import EmailActionsList from '../../scrivania/lista_email/actions/EmailActionsList';
import { dictionary } from './dictionary';
import { useOffice } from '@cmrc/auth/useOffice';

interface EmailPreviewProps {
  email: any;
  selectedRow?: EmailBaseFragment;
  isDettaglioEmail?: boolean;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  email,
  isDettaglioEmail,
  selectedRow
}) => {
  const { emailData } = useEmlBuilder(email);
  const [expanded, setExpanded] = useState(false);
  const { cdr, cdrCode } = useOffice();
  const handleChangeAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <Card elevation={3} style={{ padding: '5px', margin: '5px' }}>
      {emailData ? (
        <Grid padding={1} container direction="column">
          {/* HEADER DELLA MAIL */}
          <Grid item>
            <Box padding={2} borderBottom={1} borderColor="silver">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                {emailData.subject && (
                  <Typography variant="h6">{emailData.subject}</Typography>
                )}
                {/* MENU DELLE ACTIONS VISIBILE SOLO SE SIAMO NEL DETTAGLIO EMAIL */}
                <Box hidden={!isDettaglioEmail}>
                  <EmailActionsList
                    emailData={selectedRow}
                    cdrCode={cdrCode}
                    cdr={cdr}
                  />
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <AccountCircleIcon sx={{ width: 40, height: 40, mr: 2 }} />
                <Box flexGrow={1}>
                  {emailData.from && (
                    <Typography variant="body1"> {emailData.from}</Typography>
                  )}
                  {emailData.to && (
                    <Typography variant="body2">
                      <b>{dictionary.get('emailTo')}</b> {emailData.to}
                    </Typography>
                  )}
                  {emailData.cc && (
                    <Typography variant="body2">
                      <b>{dictionary.get('emailCc')}</b> {emailData.cc}
                    </Typography>
                  )}
                </Box>
                {emailData.date && (
                  <Typography variant="caption">{emailData.date}</Typography>
                )}
              </Box>
            </Box>
          </Grid>
          {/* BODY DELLA MAIL */}
          <Grid item>
            <Box padding={2}>
              {emailData.body && (
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{ __html: emailData.body }}
                />
              )}
            </Box>
          </Grid>
          {/* ATTACHMENTS DELLA MAIL */}
          <Grid item>
            {emailData.attachments && emailData.attachments.length > 0 && (
              <Box>
                <Accordion sx={{ '&::after': { display: 'none' } }}>
                  <AccordionSummary
                    onClick={handleChangeAccordion}
                    expandIcon={
                      expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />
                    }
                  >
                    <Typography variant="body1">
                      {emailData.attachments.length}{' '}
                      {dictionary.get('emailAllegati')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      {emailData.attachments.map((attachment) => (
                        <Grid item>
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() =>
                              buildAndDownloadFile(
                                attachment.base64,
                                attachment.fileName,
                                attachment.contentType
                              )
                            }
                          >
                            {attachment.fileName}
                            <AttachFileIcon fontSize="small" />
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6" align="center">
          {dictionary.get('datiEmailNonDisponibili')}
        </Typography>
      )}
    </Card>
  );
};
