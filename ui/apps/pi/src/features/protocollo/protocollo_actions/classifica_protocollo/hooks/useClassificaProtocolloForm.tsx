import { useForm } from "react-hook-form"
import { BaseInputProps } from "@cmrc/ui/form/FormGenerator/core/types"
import { TitolarioProtcolloForm } from "../../../protocollo_form/TitolarioProtcolloForm"

export const useClassificaProtocolloForm = () => {

  const methods = useForm<any>({
    mode: 'onBlur',
    shouldUnregister: false,
    reValidateMode: 'onChange'
  });

  const structure: BaseInputProps<any>[] = [
    {
      type: 'custom',
      name: 'titolarioCustom',
      sx: { width: { xs: 1, sm: 1 / 1 } },
      render: () => (
        <TitolarioProtcolloForm
          readMode={false}
          formMethod={methods}
        />
      )
    }
  ]

  return { methods, structure }
}