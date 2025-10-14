import { ChangeEvent, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { FCC } from '@cmrc/types/FCC';

export interface UploadButtonProps {
  inputKey: string;
  label?: string;
  isLoading?: boolean;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  meta?: { name: string; value: string | Blob }[];
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'medium' | 'small';
  startIcon?: JSX.Element;
  onUpload?: (data?: any) => void;
  path?: string;
  onUploadAllegato?: (data?: any) => void;
}

const UploadButton: FCC<UploadButtonProps> = ({
  inputKey,
  label,
  disabled,
  accept,
  multiple,
  variant = 'contained',
  size = 'small',
  startIcon,
  onUploadAllegato
}) => {
  const [files, setFiles] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadLoading(true);
    setFiles(event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      onUploadAllegato(file);
      setFiles(null);
    }

    setUploadLoading(false);
  };

  return (
    <label htmlFor={inputKey}>
      <input
        key={inputKey}
        style={{ display: 'none' }}
        accept={accept}
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
