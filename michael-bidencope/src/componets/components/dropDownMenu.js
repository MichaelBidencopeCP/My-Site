
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NavIcon } from './navComponents';
import { Box } from '@mui/system';
import { removeLoginState } from '../../localStorage';


export default function NavMenuDropdown({ loginState, onPageChange }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const logout = () => {
        removeLoginState();
        //reload page
        window.location.reload();
    }
    //page state 0: home, 1:info , 2: contact, 3: login, 4: admin, 5: projectHub(for personal use)
    return (
        <div>
            
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                
                sx={{justifyContent: 'flex-end'}}

            >
                <NavIcon />
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
                <MenuItem onClick={() => { onPageChange(0) }}>Home</MenuItem>
                <MenuItem onClick={() => { onPageChange(1) }}>Info</MenuItem>
                <MenuItem onClick={() => { onPageChange(2) }}>Contact</MenuItem>
                {loginState ? <MenuItem onClick={() => { onPageChange(4) }}>Admin</MenuItem> : null}
                {loginState ? <MenuItem onClick={() => { logout() }}>Logout</MenuItem> : null}
                {!loginState ? <MenuItem onClick={() => { onPageChange(3) }}>Login</MenuItem> : null}

            </Menu>
        </div>
    );
}


//<NavIcon id={'dropDown'} onClick={()=> {setDropDownState(true)}}/>
//                            <Menu open={dropDownState} onClose={()=> {setDropDownState(false)}} anchorEl={'dropDown'}>
//                                
//                            </Menu>