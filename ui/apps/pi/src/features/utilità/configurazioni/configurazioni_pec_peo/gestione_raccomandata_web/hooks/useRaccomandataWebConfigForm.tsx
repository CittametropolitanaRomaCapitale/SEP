import { useState, MouseEvent } from 'react';
import { BaseInputProps } from "@cmrc/ui/form/FormGenerator/core/types";
import { useForm } from "react-hook-form";
import IconButton from '@mui/material/IconButton';
import { LoginRaccomandataDtoInput } from '@cmrc/services/src/app/piapi/generated';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { dictionary } from "../dictionary";

export const useRaccomandataWebConfigForm = (props: { initialData?: LoginRaccomandataDtoInput } = null) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {event.preventDefault()};

  const methods = useForm<LoginRaccomandataDtoInput>({
    defaultValues: props?.initialData,
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<LoginRaccomandataDtoInput>[] = [
    {
      type: 'text',
      name: 'username',
      label: dictionary.get('username'),
      required: true,
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: 'text',
      name: 'gruppo',
      label: dictionary.get('gruppo'),
      required: true,
      sx: { width: { xs: 1, sm: 1 / 2 } }
    },
    {
      type: showPassword ? 'text' : 'password',
      name: 'password',
      label: dictionary.get('password'),
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
  ];

  return {methods, structure}

}
