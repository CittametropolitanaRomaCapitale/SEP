import React, { useRef, useState } from 'react';
import { useImportAnagraficaMutation } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PublishIcon from '@mui/icons-material/Publish';
import { useGetQueryAnagraficaList } from '../hooks/useDataAnagraficaList';
import { dictionary } from '../dictionary';

const FileUploadButton = () => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [importAnagrafica] = useImportAnagraficaMutation();
  const { refetch } = useGetQueryAnagraficaList();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const { result } = reader;
        if (typeof result === 'string') {
          const base64String = result.split(',')[1];
          setLoading(true);
          try {
            const response = await importAnagrafica({ fileBase64: base64String }).unwrap();
            if (response.importAnagraficaFromBase64) {
              toast.success(dictionary.get('contattiImportatiOK'))
              refetch()
            } else {
              toast.error(dictionary.get('contattiImportatiKO'))
            }
          } catch (error) {
            setLoading(false);
          } finally {
            setLoading(false);
            fileInputRef.current.value = null;
          }
        }
      };
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange} />
      <Button
        startIcon={!loading && <PublishIcon/>}
          variant="outlined"
          color="primary"
          onClick={handleUploadClick}
          disabled={loading}
          size="small"
          sx={{ width: '200px', mr: 1 }}
        >
        {loading ? <CircularProgress size={24} /> : dictionary.get('importaAnagraficaButton')}
      </Button>
    </>
  );
};

export default FileUploadButton;
