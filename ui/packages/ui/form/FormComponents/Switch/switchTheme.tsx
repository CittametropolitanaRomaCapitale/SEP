import { styled } from '@mui/material/styles';
import { Switch as MUISwitch } from '@mui/material';

export const StyledSwitch = styled(MUISwitch)(({ theme }) => ({
  width: 70,
  height: 50,
  padding: 0,
  margin: 2,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
    transform: 'translateX(-2%)',
      '&.Mui-checked': {
      transform: 'translateX(60%)',
      '& .MuiSvgIcon-root': {
        backgroundColor: '#11334dff'
        },
        '& + .MuiSwitch-track': {
        backgroundColor: '#11334dff'
      }
    }
    },
    '& .MuiSwitch-track': {
    width: 60,
    height: 20,
    borderRadius: 10,
    top: '50%',
    transform: 'translateY(50%)',
    backgroundColor: '#c8c8c8ff'
    },
  '& .MuiSvgIcon-root': {
    color: '#fff',
    backgroundColor: '#2677b7',
    width: 40,
    height: 40,
    borderRadius: '50%',
    padding: 5
  }
}));
