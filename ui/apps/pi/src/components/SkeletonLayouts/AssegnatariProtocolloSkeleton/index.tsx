import React from 'react';
import MUISkeleton from '@mui/material/Skeleton';

// le animazioni sono ['pulse', 'wave, 'false']
const animation = 'wave';

export const AssegnatariProtocolloSkeleton = () => (
    <MUISkeleton animation={animation} height="100px" />
);
