import React from 'react';
import MUISkeleton from '@mui/material/Skeleton';

// le animazioni sono ['pulse', 'wave, 'false']
const animation = 'wave';

const RaccomandataSkeleton = () => (
    <MUISkeleton animation={animation} height="250px" />
);

export default RaccomandataSkeleton;
