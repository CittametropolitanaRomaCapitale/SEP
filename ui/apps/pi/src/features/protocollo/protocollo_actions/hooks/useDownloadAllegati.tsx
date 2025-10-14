import toast from '@cmrc/ui/components/Toast';
import { dictionary } from '../../dictionary';
import { useHTTPRequests } from '../../../../utils/network_utilities';

export const useDownloadAllegati = () => {
  const { downloadRequest } = useHTTPRequests();

  const downloadAllegati = async (protocolloData) => {

    const documentName = protocolloData?.nProtocollo;

    const downloadResponse = await downloadRequest({
      url: `${process.env.NEXT_PUBLIC_API_URL}/allegato/download/zip`,
      filename: documentName + '.zip',
      forceDownload: true,
      data: {idProtocollo: protocolloData?.id}
    });

    if (downloadResponse?.ok) {
      toast.success(dictionary.get('downloadAllegatiOK'));
    } else {
    toast.error(dictionary.get('downloadAllegatiKO'));
    }
  };

  return { downloadAllegati };
};
