import { Box, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormGenerator } from './FormGenerator/core/FormGenerator';

export const TestForm = () => {
  const methods = useForm({
    defaultValues: {},
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const users = [
    {
      id: 1,
      firstName: 'Mario',
      lastName: 'Bianchi'
    },
    {
      id: 2,
      firstName: 'Valentino',
      lastName: 'Rossi'
    }
  ];

  const getUsers = (value: string) => {
    return new Promise((resolve, reject) => {
      if (!users) {
        reject(new Error('Users not found'));
      }
      resolve(Object.values(users));
    });
  };

  // <FormGenerator methods={methods} structure={} muiTheme={{ variant: 'outlined', size: 'small', color: 'primary' }} />

  return (
    <Grid container direction={'column'} rowSpacing={4}>
      <Grid item>
        <Box>
          <button onClick={methods.handleSubmit((val) => console.log(val))}>
            Send
          </button>
        </Box>
      </Grid>
      <Grid item>
        <Box>
          <FormGenerator
            methods={methods}
            structure={[
              {
                type: 'quill',
                name: 'quill1',
                componentProps: {},
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'quill',
                name: 'quill2',
                default_value: '<p><strong>Test</strong></p>',
                componentProps: {},
                sx: { width: { xs: '100%', sm: '50%' } }
              },

              {
                type: 'text',
                name: 'textField1',
                label: 'Text',
                sx: { width: { xs: '100%', sm: '50%' } },
                has_when: true,
                when: [{ accessor: 'textField2', value: 'pippo' }]
              },
              {
                type: 'text',
                name: 'textField2',
                label: 'Text [required] => Type: pippo',
                required: true,
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'text',
                name: 'textField3',
                label: 'Text [value, readonly, disabled, size, variant]',
                value: 'Ciao!',
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  readonly: true,
                  disabled: true
                }
              },

              {
                type: 'number',
                name: 'numberField1',
                label: 'Number [required]',
                precision: 0,
                required: true,
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'number',
                name: 'numberField2',
                label: 'Number [value]',
                precision: 2,
                value: '5',
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'number',
                name: 'numberField3',
                label: 'Number [value, readonly, disabled, size, variant]',
                value: '5',
                precision: 2,
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  readonly: true,
                  disabled: true
                }
              },

              {
                type: 'select',
                name: 'selectField1',
                label: 'Select [required]',
                required: true,
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ],
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'select',
                name: 'selectField2',
                label: 'Select [value]',
                value: 'b',
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ],
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'select',
                name: 'selectField3',
                label: 'Select [value, readonly, disabled, size, variant]',
                value: 'b',
                required: false,
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  readonly: true,
                  disabled: true
                },
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ]
              },

              {
                type: 'select',
                name: 'selectMultiField1',
                label: 'MultiSelect [required]',
                required: true,
                componentProps: {
                  multiple: true
                },
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ],
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'select',
                name: 'selectMultiField2',
                label: 'MultiSelect [value]',
                value: ['a', 'b'],
                componentProps: {
                  multiple: true
                },
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ],
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'select',
                name: 'selectMultiField3',
                label: 'MultiSelect [value, readonly, disabled, size, variant]',
                value: ['a', 'b'],
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  multiple: true,
                  readonly: true,
                  disabled: true
                },
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ]
              },

              {
                type: 'select-autocomplete',
                name: 'autocompleteField1',
                label: 'Autocomplete [required]',
                required: true,
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ],
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'select-autocomplete',
                name: 'autocompleteField2',
                label: 'Autocomplete [value]',
                value: { label: 'Option 1', value: 'a' },
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ],
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'select-autocomplete',
                name: 'autocompleteField3',
                label:
                  'Autocomplete [value, readonly, disabled, size, variant]',
                value: { label: 'Option 1', value: 'a' },
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  readonly: true,
                  disabled: true
                },
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ]
              },

              {
                type: 'select-autocomplete',
                name: 'autocompleteMultiField1',
                label: 'Multi Autocomplete [required]',
                required: true,
                componentProps: {
                  multiple: true
                },
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ],
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'select-autocomplete',
                name: 'autocompleteMultiField2',
                label: 'Multi Autocomplete [value]',
                value: [{ label: 'Option 2', value: 'b' }],
                componentProps: {
                  multiple: true
                },
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ],
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'select-autocomplete',
                name: 'autocompleteMultiField3',
                label:
                  'Multi Autocomplete [value, readonly, disabled, size, variant]',
                value: [{ label: 'Option 2', value: 'b' }],
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  multiple: true,
                  readonly: true,
                  disabled: true
                },
                options: [
                  { label: 'Option 1', value: 'a' },
                  { label: 'Option 2', value: 'b' }
                ]
              },

              {
                type: 'select-autocomplete',
                name: 'autocompleteQueryField1',
                label: 'Autocomplete Query [required]',
                required: true,
                sx: { width: { xs: '100%', sm: '50%' } },
                query: (value: string) => {
                  return getUsers(value);
                },
                optionMapping: (data: any) => {
                  return data?.map((user: any) => {
                    return { label: user.firstName, value: user.id };
                  });
                },
                onSelect: (value: any) => {
                  console.log(value);
                }
              },
              {
                type: 'select-autocomplete',
                name: 'autocompleteQueryField2',
                label: 'Autocomplete Query [value]',
                value: { label: 'Valentino', value: 2 },
                sx: { width: { xs: '100%', sm: '50%' } },
                query: (value: string) => {
                  return getUsers(value);
                },
                optionMapping: (data: any) => {
                  return data?.map((user: any) => {
                    return { label: user.firstName, value: user.id };
                  });
                }
              },
              {
                type: 'select-autocomplete',
                name: 'autocompleteQueryField3',
                label:
                  'Autocomplete Query [value, readonly, disabled, size, variant]',
                value: { label: 'Valentino', value: 2 },
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  readonly: true,
                  disabled: true
                },
                query: (value: string) => {
                  return getUsers(value);
                },
                optionMapping: (data: any) => {
                  return data?.map((user: any) => {
                    return { label: user.firstName, value: user.id };
                  });
                }
              },

              {
                type: 'select-autocomplete',
                name: 'autocompleteMultiQueryField1',
                label: 'Autocomplete Multi Query [required]',
                required: true,
                componentProps: {
                  multiple: true
                },
                sx: { width: { xs: '100%', sm: '50%' } },
                query: (value: string) => {
                  return getUsers(value);
                },
                optionMapping: (data: any) => {
                  return data?.map((user: any) => {
                    return { label: user.firstName, value: user.id };
                  });
                },
                onSelect: (values: any) => {
                  console.log(values);
                }
              },
              {
                type: 'select-autocomplete',
                name: 'autocompleteMultiQueryField2',
                label: 'Autocomplete Multi Query [value]',
                value: [{ label: 'Valentino', value: 2 }],
                componentProps: {
                  multiple: true
                },
                sx: { width: { xs: '100%', sm: '50%' } },
                query: (value: string) => {
                  return getUsers(value);
                },
                optionMapping: (data: any) => {
                  return data?.map((user: any) => {
                    return { label: user.firstName, value: user.id };
                  });
                }
              },
              {
                type: 'select-autocomplete',
                name: 'autocompleteMultiQueryField3',
                label:
                  'Autocomplete Multi Query [values, readonly, disabled, size, variant]',
                value: [{ label: 'Valentino', value: 2 }],
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  multiple: true,
                  readonly: true,
                  disabled: true
                },
                query: (value: string) => {
                  return getUsers(value);
                },
                optionMapping: (data: any) => {
                  return data?.map((user: any) => {
                    return { label: user.firstName, value: user.id };
                  });
                }
              },

              {
                type: 'textarea',
                name: 'textareaField1',
                label: 'Textarea [required]',
                required: true,
                componentProps: {
                  rows: 3
                },
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'textarea',
                name: 'textareaField2',
                label: 'Textarea [value]',
                value: 'Ciao!\nTest',
                componentProps: {
                  rows: 3
                },
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'textarea',
                name: 'textareaField3',
                label: 'Textarea [value, readonly, disabled, size, variant]',
                value: 'Ciao!\nTest',
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  rows: 3,
                  readonly: true,
                  disabled: true
                }
              },

              {
                type: 'date',
                name: 'date1',
                label: 'Date [required]',
                required: true,
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'date',
                name: 'date2',
                label: 'Date [value]',
                value: new Date(),
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'date',
                name: 'date3',
                label: 'Date [value, readonly, disabled, size, variant]',
                value: new Date('2022-01-28'),
                required: false,
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  readonly: true,
                  disabled: true
                }
              },

              {
                type: 'date-time',
                name: 'datetime1',
                label: 'DateTime [required]',
                required: true,
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'date-time',
                name: 'datetime2',
                label: 'DateTime [value]',
                value: new Date(),
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'date-time',
                name: 'datetime3',
                label: 'DateTime [value, readonly, disabled, size, variant]',
                value: new Date('2022-01-28'),
                required: false,
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  readonly: true,
                  disabled: true
                }
              },

              {
                type: 'time',
                name: 'time1',
                label: 'Time [required]',
                required: true,
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'time',
                name: 'time2',
                label: 'Time [value]',
                value: new Date(),
                sx: { width: { xs: '100%', sm: '50%' } }
              },
              {
                type: 'time',
                name: 'time3',
                label: 'Time [value, readonly, disabled, size, variant]',
                value: new Date('2022-01-28'),
                required: false,
                componentProps: {
                  size: 'medium',
                  variant: 'filled',
                  readonly: true,
                  disabled: true
                }
              },

              {
                type: 'checkbox',
                name: 'checkboxField1',
                label: 'Checkbox [required]',
                required: true
              },
              {
                type: 'checkbox',
                name: 'checkboxField2',
                label: 'Checkbox [value]',
                value: true
              },
              {
                type: 'checkbox',
                name: 'checkboxField3',
                label: 'Checkbox [value, disabled, size]',
                value: true,
                componentProps: {
                  size: 'medium',
                  disabled: true
                }
              },

              {
                type: 'radio',
                name: 'radio1',
                label: 'Radio Button [required]',
                required: true,
                options: [
                  { label: 'Button 1', value: 'a' },
                  { label: 'Button 2', value: 'b' }
                ]
              },
              {
                type: 'radio',
                name: 'radio2',
                label: 'Radio Button [value, horizontal]',
                value: 'b',
                componentProps: {
                  row: true
                },
                options: [
                  { label: 'Button 1', value: 'a' },
                  { label: 'Button 2', value: 'b' }
                ]
              },
              {
                type: 'radio',
                name: 'radio3',
                label: 'Radio Button [value, disabled, size, horizontal]',
                value: 'b',
                componentProps: {
                  disabled: true,
                  size: 'medium',
                  row: true
                },
                options: [
                  { label: 'Button 1', value: 'a' },
                  { label: 'Button 2', value: 'b' }
                ]
              }
            ]}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
