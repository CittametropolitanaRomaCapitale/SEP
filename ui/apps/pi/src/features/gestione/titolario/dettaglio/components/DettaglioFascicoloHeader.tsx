import LabelItem from "@cmrc/ui/components/LabelItem";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { FCC } from "@cmrc/types/FCC";
import { formatDate } from "@cmrc/ui/utils/formatters";
import { dictionary } from "../dictionary";
import { useGetQueryDettaglioTitolario } from "../hooks/useDataDettaglioFascicolo";
import { DettaglioFascicoloSkeletonHeader } from "../../../../../components/SkeletonLayouts/DettaglioTitolario/DettaglioFascicoloSkeletonHeader";

export const DettaglioFascicoloHeader: FCC = () => {
  const { data, isLoading } = useGetQueryDettaglioTitolario();


  const getStatoFascicolo = (dettaglioTitolario) => {
    if (dettaglioTitolario?.closed && dettaglioTitolario?.deleted)
      return 'ELIMINATO E CHIUSO'

    if (dettaglioTitolario?.closed)
      return 'CHIUSO'
    if (dettaglioTitolario?.deleted)
      return 'ELIMINATO'

    return 'APERTO'

  }

  return (
    <Card sx={{ padding: '30px', marginBottom: '30px' }}>
      <Box>
        {isLoading ?
          <DettaglioFascicoloSkeletonHeader />
          :
          <>
            <Stack
              paddingTop={1}
              paddingLeft={2}
              paddingRight={2}
              paddingBottom={1}
              spacing={1}
              direction="column"
            >
              <LabelItem
                label={dictionary.get('gerarchia')}
                value={data?.dettaglioTitolario?.hierarchyString} />
            </Stack>
            <Stack
              paddingTop={1}
              paddingLeft={2}
              paddingRight={2}
              paddingBottom={1}
              spacing={1}
              direction="row"
            >
              <LabelItem
                label={dictionary.get('nome')}
                value={data?.dettaglioTitolario?.label} />
              <LabelItem
                label={dictionary.get('ufficioCreazione')}
                value={data?.dettaglioTitolario?.cdr} />
              <LabelItem
                label={dictionary.get('inseritoDa')}
                value={data?.dettaglioTitolario?.nomeUtenteCreatore} />
              <LabelItem
                label={dictionary.get('dataInserimento')}
                value={formatDate({
                  date: data?.dettaglioTitolario?.tsCreation, dateOnly: false
                })} />
              <LabelItem
                label={dictionary.get('tsChiusura')}
                value={formatDate({
                  date: data?.dettaglioTitolario?.tsChiusura, dateOnly: true
                })} />
              {data?.dettaglioTitolario?.deleted &&
                <LabelItem
                  label={dictionary.get('tsDeleted')}
                  value={formatDate({
                    date: data?.dettaglioTitolario?.tsDeleted, dateOnly: false
                  })} />}
              <LabelItem
                label={dictionary.get('stato')}
                value={data?.dettaglioTitolario && getStatoFascicolo(data?.dettaglioTitolario)} />
            </Stack>
          </>
        }
      </Box>
    </Card>
  );
}