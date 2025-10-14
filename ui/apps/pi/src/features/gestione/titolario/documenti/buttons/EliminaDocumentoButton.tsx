import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingButton from '@mui/lab/LoadingButton';
import { dictionary } from '../dictionary';
import { AllegatoTable } from '../../../../protocollo/allegati/hooks/useAllegatiService';
import { useGetDocumentiTitolarioListQuery } from '../hooks/useDataDocumentiFascicolo';
import { useDeleteDocumento } from '../hooks/useDeleteDocumento';

export const EliminaDocumentoButton: FCC<{ documento?: AllegatoTable, disabled?: boolean }> = ({
  documento,
  disabled
}) => {
  const [open, setOpen] = useState(false);
  const { deleteDocumento, deleting } = useDeleteDocumento();
  const { refetch } = useGetDocumentiTitolarioListQuery();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDeleteDocumento = () => {
    const file = { ...documento, idAllegato: documento?.id };
    deleteDocumento({
      allegato: file,
      onDelete: () => {handleClose(); refetch()},
      onError: () => {handleClose()}
    })
  };

  return (
    <>
      <Button
        disabled={disabled}
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px' }}
        onClick={handleClickOpen}
      >
        <DeleteIcon titleAccess={dictionary.get('eliminaDocumento')} />
      </Button>
      <Dialog
        fullWidth={false}
        open={open}
        onClose={handleClose}
        title={dictionary.get('eliminaDocumento')}
      >
        <DialogContent>
          {dictionary.get('confermaEliminazioneDocumento')}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {dictionary.get('annulla')}
          </Button>
          <LoadingButton onClick={onDeleteDocumento} color="primary" loading={deleting}>
            {dictionary.get('conferma')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
