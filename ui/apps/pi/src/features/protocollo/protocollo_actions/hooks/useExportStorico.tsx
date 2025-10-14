import toast from '@cmrc/ui/components/Toast';
import { dictionary } from '../../storicizzazione/dictionary';
import {
  useExportStoricoMutation,
  RicercaStoricoDtoInput
} from '@cmrc/services/src/app/piapi/generated';
import { buildAndDownloadFile } from '../../../../utils/files_utilities';
import * as dateUtils from '@cmrc/ui/utils/date-utils';

export const useExportStorico = (idProtocollo: bigint) => {
  const [exportStoricoQuery] = useExportStoricoMutation();

  const dto: RicercaStoricoDtoInput = {
    idProtocollo: idProtocollo
  };

  const exportStorico = async (formato) => {
    try {
      const response = await exportStoricoQuery({
        dto,
        formato
      }).unwrap();
      if (response?.exportStorico) {
        const base64 = response?.exportStorico;
        const timestamp = dateUtils.formatQueryDateTime(
          new Date(),
          'dd-MM-yyyy_HH:mm:ss'
        );
        if (formato === 'EXCEL') {
          buildAndDownloadFile(
            base64,
            `Export_storico_${timestamp}.xlsx`,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
        } else if (formato === 'PDF') {
          buildAndDownloadFile(
            base64,
            `Export_storico__${timestamp}.pdf`,
            'application/pdf'
          );
        }
        toast.success(dictionary.get('exportOK'));
      }
    } catch (error) {
      toast.error(dictionary.get('exportError'));
    }
  };

  return { exportStorico };
};
