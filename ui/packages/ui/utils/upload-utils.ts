import axios from 'axios';
import { useSession } from 'next-auth/react';

export const useUploadFile = () => {
  const { data: session } = useSession();
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${session?.access_token}`
    }
  };
  const upload = (
    url: string,
    data: FormData,
    callback?: (response: { data?: any; error?: any }) => void
  ) => {
    axios
      .post(url, data, config)
      .then((res: any) => {
        if (res.status === 200) {
          callback?.({ data: res });
        }
      })
      .catch((error: any) => {
        callback?.({ error });
      });
  };

  const uploadPut = (
    url: string,
    data: FormData,
    callback?: (response: { data?: any; error?: any }) => void
  ) => {
    axios
      .put(url, data, config)
      .then((res: any) => {
        if (res.status === 200) {
          callback?.({ data: res });
        }
      })
      .catch((error: any) => {
        callback?.({ error });
      });
  };

  const uploadWithAbortSignal = (
    url: string,
    data: FormData,
    abortSignal: any,
    callback?: (response: { data?: any; error?: any }) => void
  ) => {
    const newConfig = {...config, ...{signal: abortSignal}};
    axios
      .post(url, data, newConfig)
      .then((res: any) => {
        if (res.status === 200) {
          callback?.({ data: res });
        }
      })
      .catch((error: any) => {
        callback?.({ error });
      });
  };

  return { upload, uploadPut, uploadWithAbortSignal };
};
