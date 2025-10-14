import toast from '@cmrc/ui/components/Toast';
import { dictionary } from '../../dictionary';
import { useHTTPRequests } from '../../../../../utils/network_utilities';

export const useDownloadAllegati = () => {
  const { downloadRequest } = useHTTPRequests();

  const downloadAllegati = async (emailData) => {

    const documentName = emailData.protocollo?.nProtocollo;

    const downloadResponse = await downloadRequest({
      url: `${process.env.NEXT_PUBLIC_API_URL}/allegato/download/zip`,
      filename: documentName + '.zip',
      forceDownload: true,
      data: {idProtocollo: emailData.protocollo?.id}
    });

    if (downloadResponse?.ok) {
      toast.success(dictionary.get('downloadAllegatiOK'));
    } else {
    toast.error(dictionary.get('downloadAllegatiKO'));
    }
  };

  return { downloadAllegati };
};
