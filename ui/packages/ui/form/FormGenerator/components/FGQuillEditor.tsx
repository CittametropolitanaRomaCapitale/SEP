import { FCC } from '@cmrc/types/FCC';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import QuillEditor from '../../FormComponents/QuillEditor';
import { useFGProvider } from '../core/context';
import { FGHookForm, OverrideRequired, QuillEditorProps } from '../core/types';

export const FGQuillEditor: FCC<
  FGHookForm<OverrideRequired<QuillEditorProps<any>>>
> = ({ componentProps, type, ...props }) => {
  const fgProviderProps = useFGProvider();
  const { setValue, trigger, control } = useFormContext();

  useEffect(() => {
    if (props?.value) {
      setValue(props.name as string, props?.value, {
        shouldValidate: control?._options?.reValidateMode === 'onChange',
        shouldDirty: true
      });
    }
  }, []);

  const _onChange = (value: string) => {
    if (value == '<p><br></p>') {
      value = '';
    }
    if (value !== props.value) {
      setValue(props.name as string, value, {
        shouldValidate: control?._options?.reValidateMode === 'onChange',
        shouldDirty: true
      });
      props.onChange(value);
    }
    // if (control?._options?.reValidateMode === 'onChange') trigger(props.name);
  };

  return (
    <>
      <QuillEditor
        {...fgProviderProps}
        {...componentProps}
        {...props}
        readonly={fgProviderProps?.readonly || componentProps?.readonly}
        value={props.value ? props.value : ''}
        onChange={_onChange}
      />
    </>
  );
};
