import { useState } from 'react';
import toast from '@cmrc/ui/components/Toast';
import { getSession } from 'next-auth/react';
import { useUploadFile } from '@cmrc/ui/utils/upload-utils';
import { dictionary } from '../dictionary';

export type UploadFileProps = {
  meta?: { name: string; value: string | Blob }[];
  fileName?: string;
  apiUrl?: string;
  onUpload?: (data?: any) => void;
  onError?: (data?: any) => void;
};

export const useUploadDocumento = () => {
  const [uploading, setUploading] = useState(false);
  const controller = new AbortController();
  const { uploadWithAbortSignal } = useUploadFile();
  const {signal} = controller;

  const uploadDocumento = async (props: UploadFileProps) => {
    const session = await getSession();
    const fileNameMessage = props?.fileName.length > 10 ? `${props?.fileName.substring(0, 10)}...` : props?.fileName;
    const formData = new FormData();
    
    if (props?.meta) {
      props?.meta.forEach((item) => {
        formData.append(item.name, item.value);
      });
    }

    const timeout = setTimeout(() => {
      controller.abort();
    }, 5 * 60 * 1000); // 5 minuti

  setUploading(true);
  uploadWithAbortSignal(props?.apiUrl, formData, signal,
    ({ data, error }) => {
      setUploading(false);
      if (data) {
        clearTimeout(timeout);
        toast.success(`Documento "${fileNameMessage}" ${dictionary.get('uploadDocumentoOK')}`);
        if (props.onUpload) props.onUpload(data);
      }
      if (error) {
        clearTimeout(timeout);
        toast.error(`${dictionary.get('uploadDocumentoKO')} "${props?.fileName}"`);
      }
    }
  );
};

  return { uploadDocumento, uploading };
};
