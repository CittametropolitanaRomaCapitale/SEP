import { useState, MouseEvent } from 'react';
import { BaseInputProps } from "@cmrc/ui/form/FormGenerator/core/types";
import { useForm } from "react-hook-form";
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AmbienteConservazione, LoginConservazioneDto } from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from "../dictionary";

export const useConservazioneConfigForm = (props: { initialData?: LoginConservazioneDto } = null) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {event.preventDefault()};

  const methods = useForm<LoginConservazioneDto>({
    defaultValues: props?.initialData,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<LoginConservazioneDto>[] = [
    {
      type: 'text',
      name: 'url',
      label: dictionary.get('url'),
      title: dictionary.get('urlTooltip'),
      required: true,
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'text',
      name: 'ente',
      label: dictionary.get('ente'),
      title: dictionary.get('enteTooltip'),
      required: true,
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'text',
      name: 'username',
      label: dictionary.get('username'),
      title: dictionary.get('usernameTooltip'),
      required: true,
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'text',
      name: 'struttura',
      label: dictionary.get('struttura'),
      title: dictionary.get('strutturaTooltip'),
      required: true,
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: showPassword ? 'text' : 'password',
      name: 'password',
      label: dictionary.get('password'),
      title: dictionary.get('passwordTooltip'),
      required: true,
      inputRightElement: (
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
      >
        <VisibilityIcon />
      </IconButton>
      ),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'select',
      name: 'ambiente',
      required: true,
      label: dictionary.get('ambiente'),
      title: dictionary.get('ambienteTooltip'),
      options: Object.values(AmbienteConservazione)?.map((ambiente) => ({
        label: ambiente,
        value: ambiente
      })),
      sx: { width: { xs: 1, sm: 1 / 2 } }
    }
  ];

  return {methods, structure}

}
