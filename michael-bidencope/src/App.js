
import './App.css';
import Header from './componets/structures/header.js';
import { createTheme, ThemeProvider  } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { HomePage } from './componets/pages/home.js';
import { ContactPage } from './componets/pages/contact.js';
import { LoginPage } from './componets/pages/login.js';
import { AdminPage } from './componets/pages/admin.js';
import { InfoPage } from './componets/pages/info';
import { useState, useEffect, createContext } from 'react';

import { getUser, postInfo, postPersonalInfo, getThemeForSite } from './api.js';

import { getLoginState } from './localStorage.js';

export const LoginContext = createContext(null);

function App() {
    
    const [pageState, setPageState] = useState(0);
    const [user, setUser] = useState({name:'Michael Bidencope', title:'Software Engineer'});
    const [info, setInfo] = useState({bio:'This is a bio'});//[bio, skills, education, workExperience
    const [login, setLogin] = useState({token:0, admin:false, username:'', id:0, exp:-1});
    const [themeFlag, setThemeFlag] = useState(false);
    const [currentTheme, setCurrentTheme] = useState({
        background_default:'#000000',
        primary_main:'#000000',
        primary_contrast:'#000000',
        backup_main:'#000000',
        backup_contrast:'#000000',
        secondary_main:'#000000',
        error:'#000000'

    });
    const [projects, setProjects] = useState([{}]);

    useEffect(() => { getUser().then((data) => {setUser({name:data.name, title:data.title,email:data.email ,city:data.city, state:data.state}); setInfo({bio:data.bio})}); }, []);
    useEffect(() => { setLogin(getLoginState()); }, []);
    useEffect(() => { getThemeForSite(login.token).then((data) => {setCurrentTheme(data);})}, [login] );
    
    useEffect(() => { 
        //check that the theme is not the default theme
        if (currentTheme.background_default != '#000000'){
            setThemeFlag(true);
        }
        else{
            setThemeFlag(false);
        }
        console.log(currentTheme);
    }, [currentTheme]);

    useEffect(() => {
        setPageState(0)
    }, [login]);

    //page state 0: home, 1:info , 2: contact, 3: login, 4: admin, 5: projectHub(for personal use)
    const handlePageChange = (page) => {setPageState(page);};

    const handleInfoChange = (info) => {
        setInfo({bio:info});
        if (login.token != 0){
            return postInfo(info, login.token).then((res) => {
                if (res){
                    return true;
                }
                else{
                    return false;
                }
            });
            
        }
        return false;
    };

    const handleUserChange = (user) => {
        setUser(user);
        postPersonalInfo(user, login.token);
    };

    const handleThemeChange = (theme) => {
        setCurrentTheme(theme);
        setThemeFlag(true);
    };

    const createThemeFromState = (currentTheme) => {
        return createTheme({
            palette: {
                mode: 'light',
                background: {
                    default: currentTheme.background_default,
                },
                primary: {
                    main: currentTheme.primary_main,
                    contrastText: currentTheme.primary_contrast,
                },
                backup: {
                    main: currentTheme.backup_main,
                    contrastText: currentTheme.backup_contrast,
                },
                secondary: {
                    main: currentTheme.secondary_main,
                },
                error: {
                    main: currentTheme.error,
                },
            }
        });
    };

    return (
        <ThemeProvider theme={themeFlag? createThemeFromState(currentTheme): theme}>
            <LoginContext.Provider value={{login, setLogin}}>
                <CssBaseline />
                <Header user={user} onPageChange={handlePageChange}/>
                { pageState === 0 ? <HomePage />: null}
                { pageState === 1 ? <InfoPage info={info} /> : null}
                { pageState === 2 ? <ContactPage /> : null}
                { pageState === 3 && login.token == 0 ? <LoginPage /> : null}
                { pageState === 4 && login.token != 0 ? <AdminPage info={info} handleInfoChange={handleInfoChange} user={user} setUserHandler={handleUserChange} currentTheme={currentTheme} handleThemeChange={handleThemeChange} /> : null}
            </LoginContext.Provider>
        </ThemeProvider>
    );
}


const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#000000',
        },
        primary: {
            main: '#000000',
            contrastText: '#000000',
        },
        backup: {
            main: '#000000',
            contrastText: '#000000',
        },
        secondary: {
            main: '#000000',
        },
        error: {
            main: '#000000',
        },
    },
    
});


export default App;
