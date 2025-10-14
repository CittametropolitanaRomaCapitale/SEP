import React from 'react';
import MUISkeleton from '@mui/material/Skeleton';

// le animazioni sono ['pulse', 'wave, 'false']
const animation = 'wave';

const StoricoProtocolloSkeleton = () => (
    <MUISkeleton animation={animation} height="100px" />
);

export default StoricoProtocolloSkeleton;
