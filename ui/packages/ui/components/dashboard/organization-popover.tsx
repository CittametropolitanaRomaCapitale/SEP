import type { FC } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import { useAuth } from '../../hooks/use-auth';

interface OrganizationPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
  offices?: any[];
  onSelectOffice?: any;
  hideAllOfficesOption?: boolean;
}

export const OrganizationPopover: FC<OrganizationPopoverProps> = (props) => {
  const {
    anchorEl,
    onClose,
    open,
    offices = [],
    onSelectOffice,
    hideAllOfficesOption,
    ...other
  } = props;
  const { user } = useAuth();

  const allOffice = {
    id: 0,
    office: {
      name: 'ALL'
    }
  };

  const handleChange = (office: any): void => {
    onSelectOffice(office, true);
    onClose?.();
  };

  const officesToDisplay = (props.hideAllOfficesOption !== undefined && props.hideAllOfficesOption) ? [...(user?.officeWithPermission || [])] : (user?.officeWithPermission?.length > 1 ? [allOffice, ...(user?.officeWithPermission || [])] : [...(user?.officeWithPermission || [])]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 248 } }}
      transitionDuration={0}
      {...other}
    >
      {officesToDisplay.map((office, index) => (
        <MenuItem
          key={`${office.id}_${index}`}
          onClick={() => handleChange(office)}
        >
          {office?.office?.name}
        </MenuItem>
      ))}
    </Popover>
  );
};