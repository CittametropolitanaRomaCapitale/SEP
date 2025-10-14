import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { FCC } from '@cmrc/types/FCC';

export interface LoadingContainerProps {
  isLoading?: boolean;
}

const LoadingContainer: FCC<LoadingContainerProps> = ({
  isLoading = true,
  children
}) => (
  <>
    {isLoading && (
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
    )}
    {!isLoading && children}
  </>
);

export default LoadingContainer;
