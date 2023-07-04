
import './App.css';
import Header from './componets/structures/header.js';
import { createTheme, ThemeProvider  } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { HomePage } from './componets/pages/home.js';
import { ContactPage } from './componets/pages/contact.js';
import { LoginPage } from './componets/pages/login.js';
import { AdminPage } from './componets/pages/admin.js';
import { InfoPage } from './componets/pages/info';
import { useState, useEffect } from 'react';

import { getUser, postInfo, postPersonalInfo } from './api.js';

import { saveLoginState, getLoginState, removeLoginState } from './localStorage.js';

function App() {
    const [pageState, setPageState] = useState(0);
    const [user, setUser] = useState({name:'Michael Bidencope', title:'Software Engineer'});
    const [info, setInfo] = useState({bio:'This is a bio'});//[bio, skills, education, workExperience
    const [token, setToken] = useState(0);

    useEffect(() => { getUser().then((data) => {setUser({name:data.name, title:data.title,email:data.email ,city:data.city, state:data.state}); setInfo({bio:data.bio})}); }, []);
    useEffect(() => { setToken(getLoginState()); }, []);

    //page state 0: home, 1:info , 2: contact, 3: login, 4: admin, 5: projectHub(for personal use)
    const handlePageChange = (page) => {setPageState(page);};
    const handleTokenChange = (token) => {setToken(token); setPageState(0); };
    const handleInfoChange = (info) => {
        setInfo({bio:info});
        if (token != 0){
            let res = postInfo(info, token);
            if (res.status == 200){
                return true;
            }
        }
        return false;
    };
    const handleUserChange = (user) => {
        setUser(user); 
        postPersonalInfo(user, token);
    };
    
    return (
        <ThemeProvider theme={theme}>
                
                <CssBaseline />
                <Header user={user} onPageChange={handlePageChange} token={token}/>
                { pageState === 0 ? <HomePage />: null}
                { pageState === 1 ? <InfoPage info={info} /> : null}
                { pageState === 2 ? <ContactPage /> : null}
                { pageState === 3 && token == 0 ? <LoginPage handleTokenState={handleTokenChange} /> : null}
                { pageState === 4 && token != 0 ? <AdminPage info={info} handleInfoChange={handleInfoChange} user={user} setUserHandler={handleUserChange}/> : null}

            
        </ThemeProvider>
    );
}


const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#787878',
        },
        primary: {
            main: '#4A7C59',
            contrastText: '#000000',
        },
        backup: {
            main: '#2F4C45',
            contrastText: '#AFC299',
        },
        secondary: {
            main: '#C8D5B9',
        },
        error: {
            main: '#92140C',
        },
    },
    
});


export default App;
