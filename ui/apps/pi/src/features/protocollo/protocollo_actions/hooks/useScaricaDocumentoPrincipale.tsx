import { useLazyGetAllegatoPrincipaleQuery } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { dictionary } from '../../dictionary';
import { useHTTPRequests } from '../../../../utils/network_utilities';

export const useScaricaDocumentoPrincipale = () => {
    const [getAllegatoPrincipale] = useLazyGetAllegatoPrincipaleQuery();
    const { downloadRequest } = useHTTPRequests();

    const scaricaDocumentoPrincipale = async (numeroProtocollo) => {
        try {
            const response = await getAllegatoPrincipale({ nProtocollo: numeroProtocollo }).unwrap();
            const documentId = response.getProtocolloAllegatoPrincipale?.id;
            const documentName = response.getProtocolloAllegatoPrincipale?.nome;

            if (!documentId || !documentName) {
                toast.warn(dictionary.get('downloadDocumentoPrincipaleWarn'));
                return;
            }

            const downloadResponse = await downloadRequest({
                url: `${process.env.NEXT_PUBLIC_API_URL}/allegato/download/${documentId}`,
                filename: documentName,
                forceDownload: true,
            });

            if (downloadResponse?.ok) {
                toast.success(dictionary.get('downloadDocumentoPrincipaleResponseOK'));
            } else {
                throw new Error(dictionary.get('downloadDocumentoPrincipaleResponseKO'));
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return { scaricaDocumentoPrincipale };
};