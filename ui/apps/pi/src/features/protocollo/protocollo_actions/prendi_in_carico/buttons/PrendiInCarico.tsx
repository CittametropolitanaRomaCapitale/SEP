import { FCC } from '@cmrc/types/FCC';
import Button from '@mui/material/Button';
import { ProtocolloBaseFragment } from '@cmrc/services/src/app/piapi/generated';
import { usePrendiInCarico } from '../../hooks/usePrendiInCarico';
import { dictionary } from '../dictionary';

export interface PrendiInCaricoProps {
  isDisabled:boolean,
  protocolloData:ProtocolloBaseFragment
}
export const PrendiInCarico: FCC<PrendiInCaricoProps> = ({isDisabled, protocolloData}) => {
  const { prendiInCarico, loading } = usePrendiInCarico()

  const handleClick = async () => {
    await prendiInCarico(protocolloData)

  };

  return (
    <Button
      onClick={handleClick}
      size="small"
      sx={{ mr: 1 }}
      variant="contained"
      disabled={isDisabled || loading}

    >
      {dictionary.get('prendiInCarico')}
    </Button>
  );
};
