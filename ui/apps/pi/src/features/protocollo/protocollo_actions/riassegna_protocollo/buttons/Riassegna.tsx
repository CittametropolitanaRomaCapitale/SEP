import Button from '@mui/material/Button';
import { dictionary } from '../dictionary';

export const Riassegna = () => (
      <Button
        onClick={() => alert('Riassegna')}
        size="small"
        sx={{ mr: 1 }}
        variant="outlined"
      >
        {dictionary.get('riassegna')}
      </Button>
  );