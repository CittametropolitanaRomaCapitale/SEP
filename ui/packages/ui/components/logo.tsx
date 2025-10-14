import PropTypes from 'prop-types';
import { styled } from '@mui/material';
import logo from '../images/logo_Roma.png';

interface LogoProps {
  variant?: 'light' | 'primary';
}

export const Logo = styled((props: LogoProps) => {
  const { variant, ...other } = props;

  const color = variant === 'light' ? '#C1C4D6' : '#5048E5';

  return <img src={logo.src} width={'200px'} />;
})``;

Logo.defaultProps = {
  variant: 'primary'
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['light', 'primary'])
};
