import { FCC } from '@cmrc/types/FCC';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import PhotoIcon from '@mui/icons-material/InsertPhoto';
import mimeTypes from 'mime-types';
import { Documento } from '@cmrc/services';

export interface MimeTypeCellProps {
  data?: Documento;
}

const MimeTypeCell: FCC<MimeTypeCellProps> = ({ data }) => {
  const mimeType = mimeTypes.lookup(data?.url);

  switch (mimeType) {
    case 'application/pdf':
      return <PdfIcon />;

    case 'image/jpeg':
    case 'image/png':
    case 'image/svg+xml':
    case 'image/bmp':
      return <PhotoIcon />;

    default:
      return <FileIcon />;
  }
};

export default MimeTypeCell;
