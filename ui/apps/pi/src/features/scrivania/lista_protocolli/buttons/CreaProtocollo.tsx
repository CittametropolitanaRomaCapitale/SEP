import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import { dictionary } from "../dictionary";

export const CreaProtocollo = () => {
  const router = useRouter();

  return (
      <Button
        onClick={() => router.push('/crea-protocollo')}
        size="small"
        sx={{ mr: 1 }}
        variant="outlined"
      >
        {dictionary.get('creaProtocollo')}
      </Button>
  );
};