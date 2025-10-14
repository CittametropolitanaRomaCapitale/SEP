import { FCC } from '@cmrc/types/FCC';
import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import toast from '../../../components/Toast';
import { isFileValid, isSizeValid } from '../../../utils/validator-utils';
import FileInput from '../../FormComponents/FileInput';
import { useFGProvider } from '../core/context';
import { FGHookForm, OverrideRequired, FileInputProps } from '../core/types';

export const FGFileInput: FCC<
  FGHookForm<OverrideRequired<FileInputProps<any>>>
> = ({ componentProps, ...props }) => {
  const { allowedExtensions, maxFileSize } = componentProps;
  const [files, setFiles] = useState(null);
  const { setValue, trigger, control } = useFormContext();

  const fgProviderProps = useFGProvider();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (isFileValid({ file, allowedExtensions })) {
        if (isSizeValid({ file, maxFileSize })) {
          setFiles(file);
          setValue(props.name as string, file);
          if (props.onChange) props.onChange(file);
          trigger(props.name);
          if (control?._options?.reValidateMode === 'onChange')
            trigger(props.name);
        } else {
          toast.warn(
            `Puoi caricare file con dimensione massima fino a ${maxFileSize} MB`
          );
        }
      } else {
        toast.warn(
          `Puoi caricare solo file con estensione: ${allowedExtensions?.join(
            ', '
          )}`
        );
      }
    }
  };

  const onClear = () => {
    setFiles(null);
    setValue(props.name as string, null);
  };

  return (
    <FileInput
      {...fgProviderProps}
      {...componentProps}
      {...props}
      file={files}
      required={props?.required}
      onChange={onChange}
      onClear={onClear}
    />
  );
};
