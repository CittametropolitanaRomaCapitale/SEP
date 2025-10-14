import { FCC } from "@cmrc/types/FCC";
import { useState, useCallback } from 'react';
import { useLazyGetClassificazioneStringByIdProtocolloQuery } from '@cmrc/services/src/app/piapi/generated';
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CircularProgress from '@mui/material/CircularProgress';
import { LightTooltip } from "../../../../components/LightTooltip";

export interface ClassificazioneTooltipProps {
  idProtocollo: BigInteger;
  title: string;
  label: string;
}

export const ClassificazioneTooltip: FCC<ClassificazioneTooltipProps> = ({ idProtocollo, label, title }) => {
  const [getClassificazione, { isLoading }] = useLazyGetClassificazioneStringByIdProtocolloQuery();
  const [classificazioneList, setClassificazioneList] = useState([]);

  const onHover = useCallback(async () => {
    const response = await getClassificazione({ idProtocollo }).unwrap();

    setClassificazioneList(response.getClassificazioneStringByIdProtocollo || []);

  }, [getClassificazione, idProtocollo]);

  const classificazioneTooltip = (
    isLoading ?
      <CircularProgress size={16} style={{ marginLeft: 10 }} />
      :
      <Box sx={{ padding: 1, maxHeight: 200, overflowY: 'auto', borderColor: 'grey.500', boxShadow: "initial" }}>
        <Typography sx={{ fontSize: '0.875rem' }} variant="subtitle2">{title}</Typography>
        <List dense sx={{ padding: 0 }}>
          {classificazioneList.map((classificazione, index) => (
            <Box key={classificazione?.id || index} sx={{ marginBottom: 0.5 }}>
              <ListItem sx={{ paddingY: 0.5 }}>
                <Grid container direction="column" justifyContent="flex-start">
                  <Grid item>
                    <ListItemText
                      primary={classificazione?.hierarchyString}
                      primaryTypographyProps={{
                        fontSize: 14,
                      }}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              {index < classificazioneList.length - 1 && (
                <Divider sx={{ marginY: 0.5 }} />
              )
              }
            </Box>
          ))
          }
        </List>
      </Box>
  );

  return (
    <LightTooltip customWidth={1200} title={label === "Si" && classificazioneTooltip} arrow onOpen={onHover} >
      <Box>
        {label}
      </Box>
    </LightTooltip>
  );
}