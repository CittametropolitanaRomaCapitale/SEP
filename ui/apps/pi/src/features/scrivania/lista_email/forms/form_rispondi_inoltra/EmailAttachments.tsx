import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography, Paper } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
import { dictionary } from "./dictionary";

export const EmailAttachments = ({ attachments, setAttachments }) => {
  const [expanded, setExpanded] = useState(false);
  // const [attachmentIdCounter, setAttachmentIdCounter] = useState(0);

  const handleChangeAccordion = () => {
    setExpanded(!expanded);
  };

  // const handleAddAttachment = () => {
  //   const newAttachment = { id: attachmentIdCounter, fileName: 'New File', base64: '', contentType: '' };
  //   setAttachments([...attachments, newAttachment]);
  //   setAttachmentIdCounter(attachmentIdCounter + 1); // Incrementa il contatore per il prossimo ID
  // };

  // const handleRemoveAttachment = (id) => {
  //   setAttachments(attachments.filter(attachment => attachment.id !== id));
  // };

  // const buildAndDownloadFile = (base64, fileName, contentType) => {
  //   // Implementa la logica per scaricare il file qui
  // };

  return (
    <Grid>
      <Box>
        <Accordion sx={{ '&::after': { display: 'none' } }}>
          <AccordionSummary onClick={handleChangeAccordion} expandIcon={expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}>
            <Typography variant="body1"> {dictionary.get('emailAllegati')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
          <Paper elevation={3} square={false} sx={{
                  width: '100%',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #aaa',
                  padding: 4
                }}
                // onDragOver={handleDragOver}
                // onDrop={handleDrop}
                // onClick={handleClick}
              >
                <Typography variant="body1" color="textSecondary">
                  {dictionary.get('Drag&DropMessage')}
                </Typography>
                <input
                  // ref={fileInputRef}
                  id="file-input"
                  style={{ display: 'none' }}
                  type="file"
                  multiple
                  // disabled={readMode}
                  // onChange={handleFileChange}
                />
              </Paper>
          {/* <Grid container spacing={1}>
          { attachments && attachments.length > 0 ? (
            attachments.map((attachment) => (
              <Grid item key={attachment.id}>
                <Button variant="text" color="primary" onClick={() => buildAndDownloadFile(attachment.base64, attachment.fileName, attachment.contentType)}>
                  {attachment.fileName}
                  <AttachFileIcon fontSize='small' />
                </Button>
                <Button variant="text" color="secondary" onClick={() => handleRemoveAttachment(attachment.id)}>Remove</Button>
              </Grid>
            ))
          ) : (
            <Grid item>
              Nessun allegato
            </Grid>
          )}
        </Grid> */}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Grid>
  );
};