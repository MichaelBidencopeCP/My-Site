import { Box, Grid,Typography, Menu, MenuItem } from '@mui/material';
import {DisplayOnlySM, DisplayGreaterThanSM} from '../components/display';
import { NavButton } from '../components/navComponents';
import NavMenuDropdown from '../components/dropDownMenu';


import { titleCase } from '../../utils';
import { useState } from 'react';

export default function Header({user, page , onPageChange, loginState}){
    return(
            <Box sx={{bgcolor: 'primary.main'}}>
                <DisplayGreaterThanSM>
                    
                    <Grid container spacing={3} p={0} pt={1}>
                

                        <Grid item xs={3} align={'left'}>
                        <NavButton>
                            <Typography color={'secondary.main'} align='left' >
                                <h1 style={{margin:'0px'}}>{titleCase(user.name)}</h1><p1 xs={'margin:0px'}>{titleCase(user.title)}</p1>
                            </Typography>
                        </NavButton>
                        </Grid>
                        <Grid item xs={9} align={'right'} >
                            <a onClick={() => {onPageChange(0)}} href='#home'><NavButton >Home</NavButton></a>
                            <a onClick={() => {onPageChange(1)}} href='#projects'><NavButton >Projects</NavButton></a>
                            <a onClick={() => {onPageChange(2)}} href='#contact'><NavButton>Contact</NavButton></a>
                            {loginState ? <a onClick={() => {onPageChange(3)}} href='#admin'><NavButton>Admin</NavButton></a> : null}
                            {loginState ? <a onClick={() => {onPageChange(4)}} href='#admin'><NavButton>Logout</NavButton></a> : null}
                            {!loginState ? <a onClick={() => {onPageChange(3)}} href='#admin'><NavButton>Login</NavButton></a> : null}
                        </Grid>
                    </Grid>
                    
                </DisplayGreaterThanSM>
                <DisplayOnlySM>
                    <Grid container spacing={3} p={1}>
                        <Grid item xs={6} align={'left'} >
                        <Typography color={'secondary.main'} align='left' >
                            <h1 style={{margin:'0px'}}>{titleCase(user.name)}</h1><p1 xs={'margin:0px'}>{titleCase(user.title)}</p1>
                        </Typography>
                        </Grid>
                        <Grid item xs={6} align={'right'}>
                            <NavMenuDropdown loginState={loginState} onPageChange={onPageChange} />  
                        </Grid>
                    </Grid>
                </DisplayOnlySM>
            </Box>
        

    );
}
//<NavIcon id={'dropDown'} onClick={()=> {setDropDownState(true)}}/>
//                            <Menu open={dropDownState} onClose={()=> {setDropDownState(false)}} anchorEl={'dropDown'}>
//                                <MenuItem onClick={() => {onPageChange(0)}}>Home</MenuItem>
//                                <MenuItem onClick={() => {onPageChange(1)}}>Projects</MenuItem>
//                                <MenuItem onClick={() => {onPageChange(2)}}>Contact</MenuItem>
//                                {loginState ? <MenuItem onClick={() => {onPageChange(3)}}>Admin</MenuItem> : null}
//                                {loginState ? <MenuItem onClick={() => {onPageChange(4)}}>Logout</MenuItem> : null}
//                                {!loginState ? <MenuItem onClick={() => {onPageChange(3)}}>Login</MenuItem> : null}
//                            </Menu>