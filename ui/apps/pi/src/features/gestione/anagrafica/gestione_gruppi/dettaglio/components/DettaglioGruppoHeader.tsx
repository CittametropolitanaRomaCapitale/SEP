import LabelItem from "@cmrc/ui/components/LabelItem";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { formatDate } from "@cmrc/ui/utils/formatters";
import { dictionary } from "../dictionary";
import { DettaglioGruppoSkeletonHeader } from "../../../../../../components/SkeletonLayouts/DettaglioGruppo/DettaglioGruppoSkeletonHeader";
import { useGetQueryDettaglioGruppo } from "../hooks/useDataDettaglioGruppo";

export const DettaglioGruppoHeader = () => {
  const { data, isLoading } = useGetQueryDettaglioGruppo();

  return (
    <Card sx={{ padding: '30px', marginBottom: '30px' }}>
      <Box>
        {isLoading ?
          <DettaglioGruppoSkeletonHeader />
          :
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
              value={data?.dettaglioGruppo?.nome} />
            <LabelItem
              label={dictionary.get('dataCreazione')}
              value={formatDate({ date: data?.dettaglioGruppo?.creation, dateOnly: false })} />
            <LabelItem
              label={dictionary.get('note')}
              value={data?.dettaglioGruppo?.note} />
          </Stack>
        }
      </Box>
    </Card>
  );
}