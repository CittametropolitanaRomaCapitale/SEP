import { FCC } from '@cmrc/types/FCC';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import toast from '@cmrc/ui/components/Toast';
import { useOffice } from '@cmrc/auth/useOffice';
import MoveDownRoundedIcon from '@mui/icons-material/MoveDownRounded';
import {
  TitolarioOutputDto,
  useSpostaFascicoloMutation
} from '@cmrc/services/src/app/piapi/generated';
import { dictionary } from '../dictionary';
import { useRicercaTitolario } from '../../../protocollo/protocollo_form/hooks/useRicercaTitolario';
import { useSnackbar } from '../../../../store/snackbar/useSnackBar';
import { useEffect, useRef } from 'react';

export type SpostaFascicoloProps = {
  disabled?: boolean;
  selectedItems: TitolarioOutputDto[];
  breadcrumb: TitolarioOutputDto[];
  onItemUpdated?: (item: any) => void;
  setDisplayCheckbox?: (displayCheckbox: any) => void;
  reset?: () => void;
};

export const SpostaFascicoli: FCC<SpostaFascicoloProps> = ({
  breadcrumb,
  selectedItems,
  disabled,
  onItemUpdated,
  setDisplayCheckbox,
  reset
}) => {
  const {
    reset: resetSnackbar,
    openWithList,
    isOpen
  } = useSnackbar({
    snackBarId: 'spostaFascicoli'
  });
  const wasOpenRef = useRef(isOpen);
  const { cdr, cdrCode, shortCdrDesc } = useOffice();
  const { getSezionePadre } = useRicercaTitolario();
  const [spostaFascicolo] = useSpostaFascicoloMutation();

  useEffect(() => {
    if (selectedItems.length > 0) {
      openWithList(
        selectedItems.map((f) => ({
          id: f.id,
          message: f.label
        }))
      );
    } else {
      resetSnackbar();
    }
  }, [selectedItems]);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      setDisplayCheckbox(false);
    }

    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const onConfirm = async () => {
    const titolarioDestinazione: TitolarioOutputDto =
      getSezionePadre(breadcrumb);
    const response = await spostaFascicolo({
      idFascicoliList: selectedItems?.map((item) => item.id),
      idFascicoloPadre: titolarioDestinazione?.id,
      cdr: `${cdr} - ${shortCdrDesc}`,
      cdrCode
    }).unwrap();

    if (response?.spostaFascicolo) {
      toast.success(dictionary.get('fascicoliSpostati'));
      resetSnackbar();
      reset();
      setDisplayCheckbox(false);
      if (onItemUpdated) {
        onItemUpdated(selectedItems);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        onClick={onConfirm}
        disabled={disabled}
        size="small"
        variant="text"
        startIcon={<MoveDownRoundedIcon />}
      >
        {dictionary.get('spostaFascicolo')}
      </Button>
    </Box>
  );
};
