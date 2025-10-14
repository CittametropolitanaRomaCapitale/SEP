import React from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ViewCompactAltSharpIcon from '@mui/icons-material/ViewCompactAltSharp';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import { Box, Typography, IconButton } from '@mui/material';
import { dictionary } from './dictionary';
import { LightTooltip } from '../../../../components/LightTooltip';

const LegendaIconeTitolario = () => (
  <LightTooltip
    title={
      <>
        <Box display="flex" alignItems="center">
          <AccountTreeIcon color="primary" fontSize="small" />
          <Typography variant="caption" marginLeft={1}>
            {dictionary.get('titolo')}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <ViewCompactAltSharpIcon color="primary" fontSize="small" />
          <Typography variant="caption" marginLeft={1}>
            {dictionary.get('sezione')}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <GridViewSharpIcon color="primary" fontSize="small" />
          <Typography variant="caption" marginLeft={1}>
            {dictionary.get('sottoSezione')}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <FolderIcon color="primary" fontSize="small" />
          <Typography variant="caption" marginLeft={1}>
            {dictionary.get('fascicoloLv1')}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <FolderCopyOutlinedIcon color="primary" fontSize="small" />
          <Typography variant="caption" marginLeft={1}>
            {dictionary.get('fascicoloLvN')}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <FolderOffIcon
            titleAccess="FASCICOLO CHIUSO"
            color="primary"
            fontSize="small"
          />
          <Typography variant="caption" marginLeft={1}>
            {dictionary.get('fascicoloChiuso')}
          </Typography>
        </Box>
      </>
    }
    placement="right"
    arrow
  >
    <IconButton>
      <Box display="flex" alignItems="center">
        <Typography variant="body2" marginRight={0.5}>
          Legenda
        </Typography>
        <InfoOutlinedIcon fontSize="small" />
      </Box>
    </IconButton>
  </LightTooltip>
);

export default LegendaIconeTitolario;
