import React from 'react';
import { FCC } from '@cmrc/types/FCC';
import Fab, { FabProps } from '@mui/material/Fab';
import { styled } from '@mui/material/styles';

type Position = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
type Size = 'small' | 'medium' | 'large';
type Variant = 'circular' | 'extended';

interface StyledFabProps extends Omit<FabProps, 'size' | 'variant'> {
  size?: Size;
  position: Position;
  $variant?: Variant;
}

const StyledFab = styled(Fab)<StyledFabProps>(({ theme, position, $variant }) => ({
  position: 'fixed',
  top: position.includes('top') ? theme.spacing(2) : 'auto',
  bottom: position.includes('bottom') ? theme.spacing(2) : 'auto',
  left: position.includes('left') ? theme.spacing(2) : 'auto',
  right: position.includes('right') ? theme.spacing(2) : 'auto',
  marginLeft: position.includes('center') ? 'calc(50% - 28px)' : '0',
  ...$variant === 'extended' && {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

interface CustomFabProps extends Omit<FabProps, 'children'> {
  icon: React.ReactNode;
  position?: Position;
  ariaLabel?: string;
  variant?: Variant;
}

const MuiFab: FCC<CustomFabProps> = ({
  color = 'default',
  disabled = false,
  ariaLabel = 'like',
  onClick,
  icon,
  position = 'bottom-right',
  variant,
  size = 'large',
  ...props
}) => {
  return (
    <StyledFab
      color={color}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      position={position}
      size={size}
      $variant={variant}
      {...(variant === 'extended' ? { variant } : {})}
      {...props}
    >
      {icon}
    </StyledFab>
  );
};

export default MuiFab;