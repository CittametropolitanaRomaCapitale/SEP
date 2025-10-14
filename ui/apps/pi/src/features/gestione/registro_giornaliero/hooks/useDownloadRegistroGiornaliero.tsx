import { useState } from 'react';
import toast from '@cmrc/ui/components/Toast';
import { RegistroGiornaliero } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';
import { useHTTPRequests } from '../../../../utils/network_utilities';

export type DownloadFileProps = {
  registroGiornaliero?: RegistroGiornaliero
};

export const useDownloadRegistroGiornaliero = () => {
  const [downloading, setDownloading] = useState(false);
  const { downloadRequest } = useHTTPRequests();

  const downloadRegistroGiornaliero = async (props: DownloadFileProps) => {
    try {
      setDownloading(true);
      if (props?.registroGiornaliero?.id) {
        const urlDownload = `${process.env.NEXT_PUBLIC_API_URL}/allegato/download-registro/${props?.registroGiornaliero?.id}`;
        const downloadResponse = await downloadRequest({
          url: urlDownload,
          filename: props?.registroGiornaliero?.file,
          forceDownload: true,
        });

        if (downloadResponse?.ok) {
          toast.success(dictionary.get('downloadRegistroGiornalieroOK'));
          setDownloading(false);
        } else {
          toast.error(dictionary.get('downloadRegistroGiornalieroKO'));
          setDownloading(false);
        }
      }
      else {
        toast.error(dictionary.get('downloadRegistroGiornalieroKO'));
        setDownloading(false);
      }
    }
    catch (error) {
      toast.error(dictionary.get('downloadRegistroGiornalieroKO'));
      setDownloading(false);
    }
  };

  return { downloadRegistroGiornaliero, downloading };
};
