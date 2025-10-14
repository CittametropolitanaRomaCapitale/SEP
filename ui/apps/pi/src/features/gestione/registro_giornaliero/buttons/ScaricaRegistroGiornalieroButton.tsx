import { FCC } from '@cmrc/types/FCC';
import DownloadIcon from '@mui/icons-material/Download';
import { LoadingButton } from '@mui/lab';
import { RegistroGiornaliero } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';
import { useDownloadRegistroGiornaliero } from '../hooks/useDownloadRegistroGiornaliero';

export const ScaricaRegistroGiornalieroButton: FCC<{ registroGiornaliero?: RegistroGiornaliero }> = ({
  registroGiornaliero
}) => {
  const { downloadRegistroGiornaliero, downloading } = useDownloadRegistroGiornaliero();

  const onDownloadDocumento = async () => {
    downloadRegistroGiornaliero({ registroGiornaliero })
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