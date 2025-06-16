import { Box, Grid,Typography } from '@mui/material';
import {DisplayOnlySM, DisplayGreaterThanSM} from '../components/display';
import { NavButton } from '../components/navComponents';
import NavMenuDropdown from '../components/dropDownMenu';
import { titleCase } from '../../utils';
import { useContext } from 'react';
import { removeLoginState } from '../../localStorage';
import { ExtrasContext, LoginContext } from '../../App';

export default function Header({user, onPageChange}){
    let {login, setLogin }= useContext(LoginContext);
    const {extras, setExtras} = useContext(ExtrasContext);
    let loginState = login.token !== 0;
    
    //maybe add selected button?

    const logout = () => {
        removeLoginState();
        
        setLogin({token:0, admin:false, username:'', id:0, exp:-1});
    }
    //page state 0: home, 1:info , 2: contact, 3: login, 4: admin, 5: projectHub(for personal use)
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
                            <a onClick={() => {onPageChange(1)}} href='#info'><NavButton >About Me</NavButton></a>
                            <a onClick={() => {onPageChange(2)}} href='#contact'><NavButton>Contact</NavButton></a>
                            {/*<a onClick={() => {onPageChange(9)}} href='#payments'><NavButton>Payments</NavButton></a>*/}
                            {extras ? <a onClick={() => {onPageChange(5)}} href='#projectHub'><NavButton>Extras</NavButton></a> : null}
                            {loginState & login.admin ? <a onClick={() => {onPageChange(4)}} href='#admin'><NavButton>Admin</NavButton></a> : null}
                            {loginState & !login.admin ? <a onClick={() => {onPageChange(7)}} href='#projectHub'><NavButton>{login.username}</NavButton></a> : null}
                            {loginState ? <a onClick={() => {logout()}} href='#home'><NavButton>Logout</NavButton></a> : null}
                            {!loginState ? <a onClick={() => {onPageChange(3)}} href='#login'><NavButton>Login</NavButton></a> : null}
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

