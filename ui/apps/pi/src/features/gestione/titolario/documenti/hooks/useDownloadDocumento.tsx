import { useState } from 'react';
import toast from '@cmrc/ui/components/Toast';
import { dictionary } from '../dictionary';
import { AllegatoTable } from '../../../../protocollo/allegati/hooks/useAllegatiService';
import { useHTTPRequests } from '../../../../../utils/network_utilities';

export type DownloadFileProps = {
  allegato?: AllegatoTable;
};

export const useDownloadDocumento = () => {
  const [downloading, setDownloading] = useState(false);
  const { downloadRequest } = useHTTPRequests();

  const downloadDocumento = async (props: DownloadFileProps) => {
    try {
      setDownloading(true);
      if (props?.allegato?.idAllegato) {
        const urlDownload = `${process.env.NEXT_PUBLIC_API_URL}/allegato/download/${props?.allegato?.idAllegato}`;
        const downloadResponse = await downloadRequest({
          url: urlDownload,
          filename: props?.allegato?.nome,
          forceDownload: true,
        });

        if (downloadResponse?.ok) {
          toast.success(dictionary.get('downloadDocumentoOK'));
          setDownloading(false);
        } else {
          toast.error(dictionary.get('downloadDocumentoKO'));
          setDownloading(false);
        }
      }
      else {
        toast.error(dictionary.get('downloadDocumentoKO'));
        setDownloading(false);
      }
    }
    catch (error) {
      toast.error(dictionary.get('downloadDocumentoKO'));
      setDownloading(false);
    }
  };

  return { downloadDocumento, downloading };
};
