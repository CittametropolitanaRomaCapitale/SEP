import axios from 'axios';
import { useSession } from 'next-auth/react';
import mimeTypes from 'mime-types';

// tipi di file supportati per essere aperti da browser in una nuova tab
const supportedTypes = [
  'application/pdf',
  'text/plain',
  'text/html',
  'text/css',
  'application/javascript',
  'application/json',
  'application/xml',
  'text/xml',
  'text/csv'
];

export const blobToFile = async ({ blob, mimeType, fileName, forceDownload = false }) => {
  const file = new Blob([blob], { type: mimeType });
  const fileURL = URL.createObjectURL(file);

  if (forceDownload || !supportedTypes.includes(mimeType)) {
    const a = document.createElement('a');
    a.href = fileURL;
    a.target = '_blank';
    a.download = fileName;
    a.click();
  } else {
    window.open(fileURL, '_blank');
  }
  URL.revokeObjectURL(fileURL);
};

export const useHTTPRequests = () => {
  const { data: session } = useSession();
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${session?.access_token}`
    }
  };
  const deleteRequest = (
    url: string,
    callback?: (response: { data?: any; error?: any }) => void
  ) => {
    axios
      .delete(url, config)
      .then((res: any) => {
        if (res.status === 200) {
          callback?.({ data: res });
        }
      })
      .catch((error: any) => {
        callback?.({ error });
      });
  };
  
  const downloadRequest = async ({
    url,
    data,
    filename,
    method = 'GET',
    callback = null,
    forceDownload = false
  }: {
    url: string;
    data?: any;
    filename?: string;
    method?: string;
    callback?: any;
    forceDownload?: boolean;
  }) => {
    const postData = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`
      },
      body: method === 'POST' ? JSON.stringify(data) : undefined
    };
  
    const requestUrl = new URL(url);
    if (method === 'GET') {
      requestUrl.search = new URLSearchParams(data)?.toString();
    }
  
    const result = await fetch(requestUrl?.toString(), postData);
    if (callback) callback(result);

    await blobToFile({
      blob: await result.blob(),
      mimeType: mimeTypes.lookup(filename),
      fileName: filename,
      forceDownload
    });

    return result;
  };

  const getRequest = (
    url: string,
    callback?: (response: { data?: any; error?: any }) => void
  ) => {
    axios
      .get(url, config)
      .then((res: any) => {
        if (res.status === 200) {
          callback?.({ data: res.data });
        }
      })
      .catch((error: any) => {
        callback?.({ error });
      });
  };

  return { deleteRequest, downloadRequest, getRequest };
};
