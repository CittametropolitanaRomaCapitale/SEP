import { FCC } from '@cmrc/types/FCC';
import React from 'react';

export const Divider: FCC<
  Partial<{ label: string; textTransform: any; marginBottom: string }>
> = ({ label, textTransform, marginBottom = '20px' }) => {
  return (
    <>
      {label && <span>{label}</span>}
      <div
        style={{
          display: 'block',
          background: 'rgb(226 226 226)',
          width: '100%',
          height: '2px',
          marginBottom: marginBottom
        }}
      />
    </>
  );
};
