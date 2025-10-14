import { useSession } from 'next-auth/react';
import mimeTypes from 'mime-types';

export const blobToFile = async ({ blob, mimeType, forceDownload = false }) => {
  const file = new Blob([blob], { type: mimeType });
  const fileURL = URL.createObjectURL(file);

  if (forceDownload) {
    const a = document.createElement('a');
    a.href = fileURL;
    a.target = '_blank';
    a.download = 'anac.xml';
    a.click();
  } else {
    window.open(fileURL);
  }
};

export const useDownloadPdf = () => {
  const { data: session } = useSession();

  const downloadPdf = async ({ url, data }: { url: string; data?: any }) => {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`
      },
      body: JSON.stringify(data)
    };
    const result = await fetch(url, postData);
    await blobToFile({
      blob: await result.blob(),
      mimeType: 'application/pdf'
    });
  };

  return { downloadPdf };
};

export const useDownloadFile = () => {
  const { data: session } = useSession();

  const downloadFile = async ({
    url,
    data,
    filename,
    method = 'GET',
    forceDownload = false
  }: {
    url: string;
    data?: any;
    filename?: string;
    method?: string;
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
    await blobToFile({
      blob: await result.blob(),
      mimeType: mimeTypes.lookup(filename),
      forceDownload
    });
  };

  return { downloadFile };
};
