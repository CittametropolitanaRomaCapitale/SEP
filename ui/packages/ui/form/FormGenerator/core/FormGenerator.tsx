import { Form } from './Form';
import { Props } from './types';
import { FGContextProps, Provider } from './context';
import { FormProvider, UseFormReturn } from 'react-hook-form';

interface FormGeneratorProps {
  methods: UseFormReturn<any, object>;
  muiTheme?: FGContextProps;
  disabled?: boolean;
  readonly?: boolean;
}

type FormGeneratorType<T> = Props<T> & FormGeneratorProps;

export const FormGenerator = <T extends any>(props: FormGeneratorType<T>) => {
  const { structure, methods, muiTheme, disabled, readonly } = props;

  return (
    <Provider
      value={
        muiTheme
          ? {
              ...muiTheme,
              disabled: disabled || false,
              readonly: readonly || false
            }
          : {
              variant: 'outlined',
              size: 'small',
              color: 'primary',
              disabled: disabled || false,
              readonly: readonly || false
            }
      }
    >
      <FormProvider {...methods}>
        <Form structure={structure} />
      </FormProvider>
    </Provider>
  );
};
