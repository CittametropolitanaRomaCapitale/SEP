import { FCC } from "@cmrc/types/FCC";
import { MouseEvent, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from "@mui/material/Box";
import MenuIcon from '@mui/icons-material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from "@cmrc/ui/components/Dialog";
import { ProtocolloBaseFragment } from "@cmrc/services/src/app/piapi/generated";
import { RifiutaProtocolloMassivo } from "./RifiutaProtocolloMassivo";
import { AssegnaProtocolloMassivo } from "./AssegnaProtocolloMassivo";
import { useDialog } from "../../../../../store/dialog/useDialog";
import { dictionary } from "./dictionary";
import { usePrendiIncCaricoMassivo } from "./hooks/usePrendiInCaricoMassivo";
import { FascicolazioneMassiva } from "./FascicolazioneMassiva";

interface LavorazioneMassivaProps {
  selectedProtocolli: ProtocolloBaseFragment[];
}

const optionValues = {
  PRENDI_IN_CARICO: 'PRENDI_IN_CARICO',
  ClASSIFICA: 'ClASSIFICA',
  ASSEGNA: 'ASSEGNA',
  RIFIUTA: 'RIFIUTA'
};

const options = [
  { label: dictionary.get('prendiInCaricoMassivo'), value: optionValues.PRENDI_IN_CARICO },
  { label: dictionary.get('classificazioneMassiva'), value: optionValues.ClASSIFICA },
  { label: dictionary.get('assegnaMassivo'), value: optionValues.ASSEGNA },
  { label: dictionary.get('rifiutaMassivo'), value: optionValues.RIFIUTA },
];

export const LavorazioneMassiva: FCC<LavorazioneMassivaProps> = ({ selectedProtocolli }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { prendiInCaricoMassivo, isLoadingPrendiInCarico } = usePrendiIncCaricoMassivo();

  const { open: openAssegnaMassivoDialog, isOpen: isOpenAssegnaMassivo, close: closeAssegnaMassivoDialog } = useDialog({
    dialog_id: `dialogAssegnaMassivo`
  })

  const { open: openRifiutoMassivoDialog, isOpen: isOpenRifiutaMassivo, close: closeRifiutaMassivoDialog } = useDialog({
    dialog_id: `dialogRifiutaMassivo`
  });

  const { open: openFascicolazioneMassivaDialog, isOpen: isOpenFascicolazioneMassivaDialog, close: closeFascicolazioneMassivaDialog } = useDialog({
    dialog_id: `FascicolazioneMassiva`
  });

  const onOpen = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onSelectMenu = async (option: { label: string; value: string }) => {
    setAnchorEl(null);
    switch (option.value) {
      case optionValues.ASSEGNA:
        openAssegnaMassivoDialog();
        break;
      case optionValues.RIFIUTA:
        openRifiutoMassivoDialog();
        break;
      case optionValues.PRENDI_IN_CARICO:
        prendiInCaricoMassivo(selectedProtocolli);
        break;
        break;
      case optionValues.ClASSIFICA:
        openFascicolazioneMassivaDialog();
        break;
      default: break;
    }
  }

  return (
    <>
      <Button
        startIcon={<MenuIcon fontSize='medium' />}
        onClick={onOpen}
        size="small"
        sx={{ mr: 1 }}
        variant={open ? "outlined" : "contained"}
        disabled={selectedProtocolli.length === 0}
      >
        {dictionary.get('lavorazioneMassiva')}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        {options.map((option) => (
          <MenuItem
            key={option?.value}
            onClick={() => onSelectMenu(option)}
          >
            {option?.label}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              {isLoadingPrendiInCarico && option?.value === optionValues.PRENDI_IN_CARICO &&
                <CircularProgress size={16} style={{ marginLeft: 10 }}
                />}
            </Box>
          </MenuItem>
        ))}
      </Menu>
      <Dialog
        title={dictionary.get('assegnaMassivoDialog')}
        open={isOpenAssegnaMassivo}
        onClose={closeAssegnaMassivoDialog}>
        <AssegnaProtocolloMassivo protocolliList={selectedProtocolli} />
      </Dialog>
      <Dialog
        title={dictionary.get('rifiutaMassivoDialog')}
        open={isOpenRifiutaMassivo}
        onClose={closeRifiutaMassivoDialog}>
        <RifiutaProtocolloMassivo protocolliList={selectedProtocolli} />
      </Dialog>
      <Dialog
        title={dictionary.get('classificaMassivoDialog')}
        open={isOpenFascicolazioneMassivaDialog}
        onClose={closeFascicolazioneMassivaDialog}>
        <FascicolazioneMassiva protocolliList={selectedProtocolli} />
      </Dialog>
    </>
  );
}