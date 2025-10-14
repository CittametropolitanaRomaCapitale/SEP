import { useLazyGenerateRicevutaQuery } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { dictionary } from '../../dictionary';
import { buildAndDownloadFile } from '../../../../utils/files_utilities';

export const useGeneraRicevuta = () => {
    const [generateRicevutaQuery] = useLazyGenerateRicevutaQuery();

  const generaRicevuta = async (
    numeroProtocollo: string,
    from,
    requestStoricoUpdate
  ) => {
    const response = await generateRicevutaQuery({
      nProtocollo: numeroProtocollo
    }).unwrap();
        if (response?.generateRicevuta) {
      buildAndDownloadFile(
        response.generateRicevuta,
        `RICEVUTA-${numeroProtocollo}.pdf`,
        'application/pdf'
      );
            toast.success(dictionary.get('ricevutaResponseOK'));
      if (from === 'dettaglioProtocollo') {
        requestStoricoUpdate?.requestStoricoUpdate();
      }
        }
    };

    return { generaRicevuta };
};
