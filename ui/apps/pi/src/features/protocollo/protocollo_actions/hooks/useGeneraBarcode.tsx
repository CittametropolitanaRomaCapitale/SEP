import { useLazyGenerateBarcodeQuery } from '@cmrc/services/src/app/piapi/generated';
import toast from '@cmrc/ui/components/Toast';
import { dictionary } from '../../dictionary';
import { buildAndDownloadFile } from '../../../../utils/files_utilities';
import { useGetQueryStoricoList } from '../../storicizzazione/hooks/useDataStoricoList';

export const useGeneraBarcode = () => {
    const [generateBarcodeQuery] = useLazyGenerateBarcodeQuery();

  const generaBarcode = async (
    numeroProtocollo,
    from,
    requestStoricoUpdate
  ) => {
    const response = await generateBarcodeQuery({
      nProtocollo: numeroProtocollo
    }).unwrap();
        if (response?.generateBarcode) {
      buildAndDownloadFile(
        response.generateBarcode,
        `BARCODE-${numeroProtocollo}.pdf`,
        'application/pdf'
      );
            toast.success(dictionary.get('barcodeResponseOK'));
      if (from === 'dettaglioProtocollo') {
        requestStoricoUpdate?.requestStoricoUpdate();
      }
        }
    };

    return { generaBarcode };
};
