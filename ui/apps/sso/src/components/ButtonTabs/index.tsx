import { Tab, Tabs } from '@mui/material';
import styled from '@mui/system/styled';

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  defaultValue: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

interface StyledTabProps {
  label?: string;
  icon?: JSX.Element;
  value: number;
}

export const ButtonTabs = styled((props: StyledTabsProps) => (
  <Tabs {...props} />
))({
  minHeight: '30px',
  height: '30px',
  '& .MuiTabs-indicator': {
    backgroundColor: 'transparent'
  }
});

export const ButtonTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  minWidth: '64px',
  minHeight: '30px',
  height: '30px',
  fontWeight: 600,
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '8px',
  fontSize: '13px',
  paddingTop: '3px',
  paddingBottom: '3px',
  paddingLeft: '12px',
  paddingRight: '12px',
  marginLeft: 0,
  '&.MuiButtonBase-root': {
    marginLeft: theme.spacing(1)
  },

  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    opacity: 1
  },
  '&.Mui-selected': {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.dark
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.primary.dark
  }
}));
