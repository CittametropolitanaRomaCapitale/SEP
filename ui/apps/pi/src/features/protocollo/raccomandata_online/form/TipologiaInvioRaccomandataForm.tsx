import { Box, Card, Grid } from "@mui/material"
import { FCC } from "@cmrc/types/FCC"
import { FormGenerator } from "@cmrc/ui/form/FormGenerator/core/FormGenerator"
import TableExternalHeader from "@cmrc/ui/components/Table/TableExternalHeader"
import { UseFormReturn } from "react-hook-form"
import { RaccomandataProtocolloInputInput } from "@cmrc/services/src/app/piapi/generated"
import { dictionary } from "../dictionary"
import { useTipologiaInvioRaccomandataForm } from "./hooks/useTipologiaInvioRaccomandataForm"

export interface TipologiaInvioRaccomandataFormProps {
	formMethod: UseFormReturn<RaccomandataProtocolloInputInput, any>
	readMode?: boolean;
}

export const TipologiaInvioRaccomandataForm: FCC<TipologiaInvioRaccomandataFormProps> = ({ formMethod, readMode }) => {
	const { structure } = useTipologiaInvioRaccomandataForm()

	return (
		<>
			<Box sx={{ marginBottom: 1 }}>
				<TableExternalHeader
					title={dictionary.get('tipologiaInvioHeader')}
				/>
			</Box>
			<Card sx={({ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 3 })}>
				<Grid
					container
					direction="column"
					rowSpacing={3}
					sx={{ width: { xs: 1 / 1, sm: 1 / 1 }, padding: 0, marginBottom: 2 }}
				>
					<Grid item>
						<FormGenerator methods={formMethod} structure={structure} disabled={readMode} />
					</Grid>
				</Grid>
			</Card>
		</>
	)
}