import { ChangeEvent, useState } from 'react';
import { FCC } from '@cmrc/types/FCC';
import LoadingButton from '@mui/lab/LoadingButton';
import { useUploadFile } from '@cmrc/ui/utils/upload-utils';
import toast from '@cmrc/ui/components/Toast';

export interface UploadButtonProps {
  inputKey: string;
  url: string;
  label?: string;
  isLoading?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  allowedExtensions?: string[];
  meta?: { name: string; value: string | Blob }[];
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'medium' | 'small';
  startIcon?: JSX.Element;
  onUpload?: (data?: any) => void;
}

const isFileValid = ({
  file,
  allowedExtensions
}: {
  file: any;
  allowedExtensions?: string[];
}) => {
  let isValid = !(allowedExtensions?.length > 0);
  allowedExtensions?.forEach((extension) => {
    if (file.name.endsWith(extension)) {
      isValid = true;
    }
  });
  return isValid;
};

const UploadButton: FCC<UploadButtonProps> = ({
  inputKey,
  url,
  label,
  disabled,
  multiple,
  allowedExtensions,
  meta,
  variant = 'contained',
  size = 'small',
  startIcon,
  onUpload
}) => {
  const [files, setFiles] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { upload } = useUploadFile();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (isFileValid({ file: event.target.files[0], allowedExtensions })) {
        setFiles(event.target.files);
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('uploadedFile', file);
        if (meta) {
          meta.forEach((item) => {
            formData.append(item.name, item.value);
          });
        }
        setUploadLoading(true);
        upload(
          `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
          formData,
          ({ data, error }) => {
            setUploadLoading(false);
            if (data) {
              toast.success('Allegato caricato con successo!');
              if (onUpload) onUpload(data);
            }
            if (error) {
              toast.error("Non è stato possibile caricare l'allegato!");
            }
          }
        );
        setFiles(null);
      } else {
        toast.warn(
          `Puoi caricare solo file con estensione: ${allowedExtensions?.join(
            ', '
          )}`
        );
      }
    }
  };

  return (
    <label htmlFor={inputKey}>
      <input
        key={inputKey}
        style={{ display: 'none' }}
        accept={allowedExtensions?.join(', ')}
        id={inputKey}
        multiple={multiple || false}
        type="file"
        onChange={onChange}
        value={files || ''}
      />
      <LoadingButton
        startIcon={startIcon}
        disabled={disabled}
        loading={uploadLoading}
        variant={variant}
        size={size}
        component="span"
      >
        {label}
      </LoadingButton>
    </label>
  );
};

export default UploadButton;
