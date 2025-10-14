import { FCC } from '@cmrc/types/FCC';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import { SnackBar } from '../../../components/SnackBar';
import { dictionary } from './dictionary';

export const TitolarioSnackBars: FCC = () => (
  <>
    <SnackBar
      title={dictionary.get('spostaFascicolo')}
      snackBarId="spostaFascicoli"
      vertical="bottom"
      horizontal="right"
      isListMessage
      listMessageDescription="Fascicoli"
      leftIcon={<FolderIcon />}
    />

    <SnackBar
      title={dictionary.get('spostaDocumenti')}
      snackBarId="spostaDocumenti"
      vertical="bottom"
      horizontal="right"
      isListMessage
      listMessageDescription="Documenti"
      leftIcon={<DescriptionIcon />}
    />

    <SnackBar
      title={dictionary.get('spostaProtocolli')}
      snackBarId="spostaProtocolli"
      vertical="bottom"
      horizontal="right"
      isListMessage
      listMessageDescription="Protocolli"
      leftIcon={<DescriptionIcon />}
    />
  </>
);
