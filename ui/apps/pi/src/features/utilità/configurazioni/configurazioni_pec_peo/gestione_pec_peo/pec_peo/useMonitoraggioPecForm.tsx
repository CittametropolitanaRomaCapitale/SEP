import { useForm } from 'react-hook-form';
import { BaseInputProps } from '@cmrc/ui/form/FormGenerator/core/types';
import { dictionary } from './dictionary';
import { useEffect } from 'react';
import { getValue } from '@mui/system';
import { Pattern } from '@mui/icons-material';

type DayInterval = {
  dayOfWeek: string;
  start: string;
  end: string;
};

type MonitoraggioPecForm = {
  finestre: DayInterval[];
  threshold: number;
  durationMinutes: number;
  enabled: boolean;
};

export const useMonitoraggioPecForm = (regole) => {
  const days = [
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
    'Domenica'
  ];

  const methods = useForm<MonitoraggioPecForm>({
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange',
    defaultValues: {
      threshold: regole?.regole?.threshold ?? null,
      durationMinutes: regole?.regole?.durationMinutes ?? null,
      enabled: regole?.regole?.enabled ?? false
    }
  });

  const dayFields: BaseInputProps<MonitoraggioPecForm>[] = days.flatMap(
    (day, index) => [
      {
        type: 'text',
        name: `dayOfWeek${index}`,
        label: day,
        sx: {
          width: 1 / 3,
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .Mui-disabled': {
            backgroundColor: 'transparent',
            color: 'black',
            fontSize: 15,
            cursor: 'text',
            fontWeight: 'bold'
          }
        },
        disabled: true
      },
      {
        type: 'time',
        name: `start${index}`,
        value: regole?.regole?.finestre?.find((f) => f.dayOfWeek === index + 1)
          ?.start
          ? new Date(
              `2025-01-01T${
                regole?.regole?.finestre?.find((f) => f.dayOfWeek === index + 1)
                  ?.start
              }:00`
            )
          : null,
        label: dictionary.get('timeFrom'),
        sx: { width: 1 / 3 }
      },
      {
        type: 'time',
        name: `end${index}`,
        value: regole?.regole?.finestre?.find((f) => f.dayOfWeek === index + 1)
          ?.end
          ? new Date(
              `2025-01-01T${
                regole?.regole?.finestre?.find((f) => f.dayOfWeek === index + 1)
                  ?.end
              }:00`
            )
          : null,
        label: dictionary.get('timeTo'),
        sx: { width: 1 / 3 }
      }
    ]
  );

  const commonFields: BaseInputProps<MonitoraggioPecForm>[] = [
    {
      type: 'text',
      name: 'threshold',
      label: dictionary.get('nPec'),
      precision: 0,
      required: true,
      validation: {
        pattern: { value: /^[0-9]*$/, message: 'Inserisci solo numeri interi' }
      },
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'text',
      name: 'durationMinutes',
      label: dictionary.get('nMinuti'),
      precision: 0,
      required: true,
      validation: {
        pattern: { value: /^[0-9]*$/, message: 'Inserisci solo numeri interi' }
      },
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'checkbox',
      name: 'enabled',
      label: dictionary.get('enableMonitoraggio'),
      sx: {
        width: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
  ];

  const structure: BaseInputProps<MonitoraggioPecForm>[] = [
    ...dayFields,
    ...commonFields
  ];

  return { methods, structure };
};
