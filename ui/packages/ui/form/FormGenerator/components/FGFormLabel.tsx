import { FunctionComponent } from 'react';
import FormLabel from '../../FormComponents/FormLabel';
import { useFGProvider } from '../core/context';
import { FGHookForm, OverrideRequired, FormLabelProps } from '../core/types';

export const FGFormLabel: FunctionComponent<
  FGHookForm<OverrideRequired<FormLabelProps<any>>>
> = ({ componentProps, ...props }) => (
  <FormLabel {...useFGProvider()} {...componentProps} {...props} />
);
