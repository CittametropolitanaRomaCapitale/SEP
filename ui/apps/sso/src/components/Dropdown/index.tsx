import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { FCC } from '@cmrc/types/FCC';

export interface DropdownProps {
  options: { label: string; value: string | number; onSelect: () => void }[];
}

const Dropdown: FCC<DropdownProps> = ({ options }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const onOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onSelectMenu = ({ onSelect }) => {
    setAnchorEl(null);
    onSelect();
  };

  return (
    <Stack direction="row" spacing={2} alignItems="baseline">
      <IconButton
        aria-label="delete"
        onClick={onOpen}
        size="small"
        sx={{ width: '30px', height: '30px', minWidth: '30px', mr: 1 }}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        {options.map((option) => (
          <MenuItem key={option?.value} onClick={() => onSelectMenu(option)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

export default Dropdown;
