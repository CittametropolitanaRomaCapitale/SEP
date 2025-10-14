import { useUploadFile } from '@cmrc/ui/utils/upload-utils';
import toast from '@cmrc/ui/components/Toast';

export const useUploadAllegato = () => {
  const { upload } = useUploadFile();
  const uploadAllegato = ({ file, id, url, onUpload }) => {
    const formData = new FormData();
    formData.append('uploadedFile', file);
    formData.append('delegationId', id);
    upload(url, formData, ({ data: uploadData, error }) => {
      if (uploadData) {
        toast.success('Allegato caricato con successo!');
        onUpload?.();
      }
      if (error) {
        toast.error("Non è stato possibile caricare l'allegato!");
      }
    });
  };
  return { uploadAllegato };
};
