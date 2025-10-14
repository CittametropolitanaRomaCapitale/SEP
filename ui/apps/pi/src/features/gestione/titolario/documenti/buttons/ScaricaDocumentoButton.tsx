import { FCC } from '@cmrc/types/FCC';
import DownloadIcon from '@mui/icons-material/Download';
import { LoadingButton } from '@mui/lab';
import { dictionary } from '../dictionary';
import { AllegatoTable } from '../../../../protocollo/allegati/hooks/useAllegatiService';
import { useDownloadDocumento } from '../hooks/useDownloadDocumento';

export const ScaricaDocumentoButton: FCC<{ documento?: AllegatoTable }> = ({
  documento
}) => {
  const { downloadDocumento, downloading } = useDownloadDocumento();

  const onDownloadDocumento = async () => {
    const file = { ...documento, idAllegato: documento?.id };
    downloadDocumento({
      allegato: file
    })
  };

  return (
    <LoadingButton
      loading={downloading}
      size="small"
      sx={{ width: '30px', height: '30px', minWidth: '30px' }}
      onClick={onDownloadDocumento}
    >
      <DownloadIcon titleAccess={dictionary.get('scaricaDocumento')} />
    </LoadingButton>
  );
};