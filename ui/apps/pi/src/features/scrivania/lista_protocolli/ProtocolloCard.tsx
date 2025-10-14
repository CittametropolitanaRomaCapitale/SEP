import { FCC } from "@cmrc/types/FCC";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { formatDate } from "@cmrc/ui/utils/formatters";
import { toSentence } from "@cmrc/ui/utils/string-utils";
import { ProtocolloBaseFragment } from "@cmrc/services/src/app/piapi/generated";
import ProtocolloActionsList from "../../protocollo/protocollo_actions/ProtocolloActionsList";
import { dictionary } from "./dictionary";

type ProtocolloCardProps = {
  protocollo: ProtocolloBaseFragment
}

export const ProtocolloCard: FCC<ProtocolloCardProps> = ({ protocollo }) => {

  const handleClick = () => {
    alert('clicked');
  }

  return (
    <Card sx={{ padding: 3, marginBottom: 3 }}>
      <Grid container sx={{ width: 1 }}>
        <Grid item xs={12}>
          <Button onClick={handleClick} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
            <Typography>
              {`${dictionary.get('numero')}: ${protocollo.nProtocollo}`}
            </Typography>
            <Box>
              <strong>{dictionary.get('tipoRegistrazione')}:</strong> {toSentence(protocollo?.tipoRegistrazione)}
            </Box>
            <Box>
              <strong>{dictionary.get('metodoSpedizione')}:</strong> {toSentence(protocollo?.metodoSpedizione)}
            </Box>
            <Box>
              <strong>{dictionary.get('tsCreation')}:</strong> {formatDate({ date: protocollo?.tsCreation, dateOnly: false })}
            </Box>
            <Box>
              <strong>{dictionary.get('oggetto')}:</strong> {protocollo?.oggetto}
            </Box>
            <Box>
              <strong>{dictionary.get('mittente')}:</strong> {protocollo?.mittente}
            </Box>
            <Box>
              <strong>{dictionary.get('destinatari')}:</strong> {protocollo?.destinatari}
            </Box>
            <Box>
              <Chip
                label={toSentence(protocollo?.stato)}
                size="small"
                color={protocollo?.stato === 'Annullato' ? 'error' : 'primary'}
              />
            </Box>
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <ProtocolloActionsList protocolloData={protocollo} from='protocolli' />
          </Box>
        </Grid>
      </Grid>
    </Card>
  )
}