import { Grid } from "@mui/material"
import { FCC } from "@cmrc/types/FCC"
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator"
import { UseFormReturn } from "react-hook-form"
import { useMittenteProtocolloForm } from "./hooks/useMittenteProtocolloForm"
import { ProtocolloForm } from "./hooks/useDestinatariProtocolloForm"

export interface MittenteProtocolloFormProps {
	readMode?: boolean
	tipoRegistrazioneSel: string
	metodoSpedizioneSel: string
	formMethod: UseFormReturn<ProtocolloForm, any>
}

export const MittenteProtocolloForm: FCC<MittenteProtocolloFormProps> = ({ readMode, tipoRegistrazioneSel, metodoSpedizioneSel, formMethod }) => {
	const { structure } = useMittenteProtocolloForm(readMode, tipoRegistrazioneSel, metodoSpedizioneSel, formMethod)

	return (
    <Grid item>
      <FormGenerator methods={formMethod} structure={structure} />
    </Grid>
	)
}