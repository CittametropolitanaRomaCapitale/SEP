import { useState } from 'react';

export const usePopover = () => {
  const [anchorElPopover, setAnchorEl] = useState(null);

  const openPopover = (event: any): void => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = (): void => {
    setAnchorEl(null);
  };

  const isOpenPopover = Boolean(anchorElPopover);

  return {
    openPopover,
    closePopover,
    isOpenPopover,
    anchorElPopover
  };
};
