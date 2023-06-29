
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NavIcon } from './navComponents';

export default function NavMenuDropdown({loginState, onPageChange}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        
      >
        <NavIcon/>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => {onPageChange(0)}}>Home</MenuItem>
        <MenuItem onClick={() => {onPageChange(1)}}>Projects</MenuItem>
        <MenuItem onClick={() => {onPageChange(2)}}>Contact</MenuItem>
        {loginState ? <MenuItem onClick={() => {onPageChange(3)}}>Admin</MenuItem> : null}
        {loginState ? <MenuItem onClick={() => {onPageChange(4)}}>Logout</MenuItem> : null}
        {!loginState ? <MenuItem onClick={() => {onPageChange(3)}}>Login</MenuItem> : null}
        
      </Menu>
    </div>
  );
}


//<NavIcon id={'dropDown'} onClick={()=> {setDropDownState(true)}}/>
//                            <Menu open={dropDownState} onClose={()=> {setDropDownState(false)}} anchorEl={'dropDown'}>
//                                
//                            </Menu>