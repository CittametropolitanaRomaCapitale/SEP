import React, { useRef, useState } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { useImportProtocolliEmergenzaMutation } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Typography } from '@mui/material';
import { dictionary } from './dictionary';
import { useOffice } from '@cmrc/auth/useOffice';


export const ImportProtocolliAction: FCC<{ onResults?: any }> = ({
  onResults
}) => {
  const {cdr, cdrCode} = useOffice();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [chosenFile, setChosenFile] = useState(null);
  const [importProtocolliEmergenza] = useImportProtocolliEmergenzaMutation();


  const handleFileConfirmed = () => {
    if (fileInputRef.current) {
      const file = fileInputRef.current.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const { result } = reader;
          if (typeof result === 'string') {
            const base64String = result.split(',')[1];
            setLoading(true);
            try {
              const response = await importProtocolliEmergenza({ fileBase64: base64String, selectedOffice: cdrCode, cdr: cdr }).unwrap();
              if (response.importProtocolliEmergenzaFromBase64) {
                toast.success(dictionary.get('protocolliImportatiOK'));
                if (onResults)
                  onResults(response.importProtocolliEmergenzaFromBase64);
              } else {
                toast.error(dictionary.get('protocolliImportatiKO'));
                if (onResults)
                  onResults([]);
              }
            } catch (error) {
              setLoading(false);
            } finally {
              setLoading(false);
              setChosenFile(null);
              fileInputRef.current.value = null;
            }
          }
        };
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setChosenFile(file);
    if (onResults) onResults([]);
  };

  const handleSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const textButton = chosenFile !== null ? dictionary.get('confirmImportFile') : dictionary.get('selectImportFile');

  return (
    <Box sx={{ mb:3, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <input
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange} />
      { chosenFile &&
        <>
          <Typography variant='caption'>{dictionary.get('selectedFilename', {'file': chosenFile.name})}</Typography>
          <Button
            startIcon={<DeleteIcon />}
            variant="contained"
            color="error"
            size="small"
            disabled={loading}
            onClick={() => {setChosenFile(null)}}
            sx={{marginX: 1}}
          >{dictionary.get('deleteChosenFile')}</Button>
        </>
      }
      <Button
        startIcon={!loading && <PublishIcon/>}
        variant={chosenFile !== null ? "contained" : "outlined"}
        color="primary"
        onClick={chosenFile !== null ? handleFileConfirmed : handleSelectFileClick}
        disabled={loading}
        size="small"
        sx={{ width: '200px', mr: 1 }}
      >
        {loading ? <CircularProgress size={24} /> : textButton}
      </Button>
    </Box>
  );
};

export default ImportProtocolliAction;
