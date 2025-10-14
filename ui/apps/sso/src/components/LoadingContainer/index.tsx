import { FCC } from '@cmrc/types/FCC';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export interface LoadingContainerProps {
  isLoading?: boolean;
  children?: any;
}

const LoadingContainer: FCC<LoadingContainerProps> = ({
  isLoading = true,
  children
}) =>
  isLoading ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      minHeight="200px"
    >
      <CircularProgress color="info" />
    </Box>
  ) : (
    children
  );

export default LoadingContainer;
