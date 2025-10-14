import { FCC } from "@cmrc/types/FCC";
import { useState, useCallback } from 'react';
import { toSentence } from '@cmrc/ui/utils/string-utils';
import { useLazyGetAssegnatariTooltipForProtocolloQuery } from '@cmrc/services/src/app/piapi/generated';
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Divider, Grid, Typography } from "@mui/material";
import { getColorChip } from "../../../protocollo/assegnatari/useAssegnatariTable";
import { LightTooltip } from "../../../../components/LightTooltip";

export interface VisualizzaStatoTooltipProps {
  idProtocollo: BigInteger;
  label: string;
  title: string;
  isErrorColor: boolean;
}

export const VisualizzaStatoTooltip: FCC<VisualizzaStatoTooltipProps> = ({ idProtocollo, label, title, isErrorColor }) => {
  const [getAssegnatariTooltipQuery, { isLoading }] = useLazyGetAssegnatariTooltipForProtocolloQuery();
  const [statoAssegnatariProtocollo, setStatoAssegnatariProtocollo] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const onHover = useCallback(async () => {
    if (!isOpen) {
      setIsOpen(true);
      const response = await getAssegnatariTooltipQuery({
        idProtocollo
      }, !idProtocollo
      ).unwrap();

      if (response?.getAssegnatariTooltipForProtocollo) {
        setStatoAssegnatariProtocollo(response.getAssegnatariTooltipForProtocollo || []);
      }
    }
  }, [getAssegnatariTooltipQuery, idProtocollo, isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setStatoAssegnatariProtocollo([]);
  }, []);

  const listAssegnatari = (
    isLoading ?
      <CircularProgress size={16} style={{ marginLeft: 10 }} />
      :
      <Box sx={{ padding: 1, maxHeight: 200, overflowY: 'auto', borderColor: 'grey.500', boxShadow: "initial" }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>{title}</Typography>
        <List dense sx={{ padding: 0 }}>
          {statoAssegnatariProtocollo.map((assegnatario, index) => (
            <Box key={assegnatario?.id || index} sx={{ marginBottom: 0.5 }}>
              <ListItem sx={{ paddingY: 0.5 }}>
                <Grid container direction="column" justifyContent="flex-start">
                  <Grid item>
                    <ListItemText
                      primary={`${assegnatario?.nomeDestinatario}${assegnatario?.ufficioLavorazione ? ' (' + assegnatario?.ufficioLavorazione + ') ' : ''}`}
                      primaryTypographyProps={{ fontSize: 14 }}
                    />
                  </Grid>
                  <Grid item>
                    <ListItemIcon>
                      <Chip
                        size="small"
                        color={getColorChip(assegnatario.statoProtocollo)}
                        label={assegnatario.statoProtocollo != null ? toSentence(assegnatario.statoProtocollo) : 'N.D.'}
                        sx={{ fontSize: 13 }}
                      />
                    </ListItemIcon>
                  </Grid>
                </Grid>
              </ListItem>
              {
                index < statoAssegnatariProtocollo.length - 1 && (
                  <Divider sx={{ marginY: 0.5 }} />
                )
              }
            </Box>
          ))
          }
        </List >
      </Box >
  );

  return (
    <LightTooltip
      arrow
      sx={{ zIndex: 1000 }}
      customWidth={600}
      title={statoAssegnatariProtocollo?.length > 0 && listAssegnatari}
      onOpen={onHover}
      open={isOpen}
      onClose={handleClose}
    >
      <Chip
        label={label}
        size="small"
        color={isErrorColor ? 'error' : 'primary'} />
    </LightTooltip>
  );
}