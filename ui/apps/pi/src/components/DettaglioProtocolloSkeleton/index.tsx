import Box from '@mui/material/Box';
import { FCC } from '@cmrc/types/FCC';
import { Card } from '@mui/material';
import RiepilogoSkeletonTop from '../SkeletonLayouts/RiepilogoSkeletonTop';
import { CreaProtocolloSkeletonForm } from '../SkeletonLayouts/CreaProtocolloSkeletonForm';
import StoricoProtocolloSkeleton from '../SkeletonLayouts/StoricoProtocolloSkeleton';
import { useGetQueryDettaglioProtocollo } from '../../features/protocollo/useDataDettaglioProtocollo';
import RaccomandataSkeleton from '../SkeletonLayouts/RaccomandataSkeleton';
import { AssegnatariProtocolloSkeleton } from '../SkeletonLayouts/AssegnatariProtocolloSkeleton';
import { useGetQueryReferentiProtocollo } from '../../features/protocollo/assegnatari/hooks/useDataReferentiProtocollo';

export const DettaglioProtocolloSkeleton: FCC = ({ children }) => {
  const { isLoading: isloadingReferenti } = useGetQueryReferentiProtocollo();
  const { isLoading: isLoadingDettaglio } = useGetQueryDettaglioProtocollo();

  return (
    <>
      {isloadingReferenti || isLoadingDettaglio && (
      <>
        <Card sx={{ padding: '30px', paddingBottom: '20px', marginBottom: '30px', marginTop: '55px' }}>
          <Box>
            <RiepilogoSkeletonTop />
          </Box>
        </Card>
        <Card sx={{ padding: '30px', paddingBottom: '20px', marginBottom: '30px', marginTop: '55px' }}>
          <Box>
            <AssegnatariProtocolloSkeleton />
          </Box>
        </Card>
        <Card sx={{ paddingLeft: '20px', paddingRight: '20px', marginTop: '20px', marginBottom: '30px' }}>
          <Box>
            <CreaProtocolloSkeletonForm />
          </Box>
        </Card>
        <Card sx={{ paddingLeft: '35px', paddingRight: '35px', marginTop: '30px', marginBottom: '30px' }}>
          <Box>
            <RaccomandataSkeleton />
          </Box>
        </Card>
        <Card sx={{ paddingLeft: '35px', paddingRight: '35px' }}>
          <Box>
            <StoricoProtocolloSkeleton />
          </Box>
        </Card>
      </>
      )}
      {!isLoadingDettaglio && !isloadingReferenti && children}
    </>
  )
};
