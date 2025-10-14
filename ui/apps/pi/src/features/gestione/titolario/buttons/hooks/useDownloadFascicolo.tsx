import toast from '@cmrc/ui/components/Toast';
import { dictionary } from '../../dictionary';
import { useHTTPRequests } from '../../../../../utils/network_utilities';
import { useOffice } from '@cmrc/auth/useOffice';

export const useDownloadFascicolo = () => {
  const { downloadRequest } = useHTTPRequests();
  const { cdrCode } = useOffice();

  const downloadFascicolo = async (titolarioData) => {
    const fascicoloName = titolarioData?.label;
    const downloadResponse = await downloadRequest({
      url: `${process.env.NEXT_PUBLIC_API_URL}/allegato/download/titolario/zip/${titolarioData?.id}/${cdrCode}`,
      filename: fascicoloName + '.zip',
      forceDownload: true
    });

    if (downloadResponse?.ok) {
      toast.success(dictionary.get('successoDownloadFascicolo'));
    } else {
      toast.error(dictionary.get('erroreDownloadFascicolo'));
    }
  };

  return { downloadFascicolo };
};
