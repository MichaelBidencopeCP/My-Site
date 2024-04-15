
import './App.css';
import Header from './componets/structures/header.js';
import { createTheme, ThemeProvider  } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { HomePage } from './componets/pages/home.js';
import { ContactPage } from './componets/pages/contact.js';
import { LoginPage } from './componets/pages/login.js';
import { AdminPage } from './componets/pages/admin.js';
import { InfoPage } from './componets/pages/info';
import { useState, useEffect, createContext, useMemo, useRef } from 'react';

import { getUser, postInfo, postPersonalInfo, getThemeForSite, getUpdateValue, setUpdateValueAPI, getExtrasEnabled } from './api.js';

import {  checkForUpdate, getLoginState, getThemeFromLocal, getUserInfoLocal, saveTheme, saveUserInfo, setUpdateValue } from './localStorage.js';
import { ExtrasPage } from './componets/extras/extras';

export const LoginContext = createContext(null);
export const UpdateContext = createContext(null);
export const ExtrasContext = createContext(null);


function App() {
    //update is used to denote a change in the database that requires a cache update, if update if false then no update is needed
    const [update, setUpdate] = useState({
        update:false,
        updatedProjects:false,
        updatedUserInfo:false,
        updatedTheme:false,
        updatedTags:false,
        //set true, if admin changes the database. This will cause the cache to be updated.
        activeUpdate:false
    });    
    const [pageState, setPageState] = useState(0);
    const [user, setUser] = useState({name:'Michael Bidencope', title:'Software Engineer'});
    const [info, setInfo] = useState({bio:'This is a bio'});
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
    const [extras, setExtras] = useState(false);
    const initialRender = useRef(true);
    useEffect(
        () => {
            if (login.token == 0){
                return;
            }
            getExtrasEnabled(login.token).then((response) => {
                response = response.response;
                setExtras(response);
            });

        }, [login.token]
    );
    useEffect(() => {
        
        //check update value to see if cache needs to be updated
        getUpdateValue().then((data) => {
            if(initialRender.current){
                let updateCheck = checkForUpdate(data);
                if (updateCheck){
                    let hold = {...update}
                    hold.update = updateCheck;
                    setUpdate(hold);
                    
                }
            }
        }).then(() => { initialRender.current = false;} );
        
    }, []);
    //set login from cache if token expired state will be set to logged out values
    useEffect(() => { setLogin(getLoginState()); }, []);
    //set user info from api or cache
    useMemo(() => {
        if(initialRender.current){
            return;
        }
        let updateFlag = false;
        if(update.update === false){
            let data = getUserInfoLocal()
            if(data){
                setUser({name:data.name, title:data.title,email:data.email ,city:data.city, state:data.state});
                setInfo({bio:data.bio});
            }
            else{
                updateFlag = true;
            }
        }
        if(update.update || updateFlag){ 
            getUser().then((data) => {
                if(update.updatedUserInfo == false){
                    setUser({name:data.name, title:data.title,email:data.email ,city:data.city, state:data.state});
                    setInfo({bio:data.bio})
                    //save user info to cache
                    saveUserInfo({name:data.name, title:data.title,email:data.email ,city:data.city, state:data.state, bio:data.bio})
                    let hold = {...update}
                    hold.updatedUserInfo = true;
                    setUpdate(hold);
                }
            });
        }
        
    }, [initialRender.current, update.update]);
    
    //set theme from api or cache
    useMemo(() => {
        if(initialRender.current){
            return;
        }
        let flagToUpdateTheme = false;
        if(update.update === false){
            if(login.token != 0){
                let localTheme = getThemeFromLocal(login.id);
                if(localTheme){
                    setCurrentTheme(localTheme);
                }
                else{
                    localTheme = getThemeFromLocal();
                    if(localTheme){
                        setCurrentTheme(localTheme);
                    }
                    else{
                        flagToUpdateTheme = true;
                    }
                }
            }
        
            else{
                let localTheme = getThemeFromLocal();
                if(localTheme){
                    setCurrentTheme(localTheme);
                }
                else{
                    flagToUpdateTheme = true;
                }
            }
        }
        if(update.update || flagToUpdateTheme){
            if(update.updatedProjects == false){
                getThemeForSite(login.token).then((data) => {
                    setCurrentTheme(data);
                    if(login.id != 0){
                        saveTheme(data, login.id);
                    }
                    else{
                        saveTheme(data);
                    }
                    let hold = {...update};
                    hold.updatedTheme = true;
                    setUpdate(hold);
                });
            }
        }
    }, [initialRender.current, update.update]);
    
    useEffect(() => { 
        //check that the theme is not the default theme
        if (currentTheme.background_default != '#000000'){
            setThemeFlag(true);
        }
        else{
            setThemeFlag(false);
        }
    }, [currentTheme]);

    useEffect(() => {
        setPageState(0)
    }, [login]);

    useEffect(() => {
        if(update.activeUpdate){
            let hold = {...update};
            hold.activeUpdate = false;
            hold.update = true;
            setUpdate(hold);
        }
    }, [update.activeUpdate]);

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
        if(postPersonalInfo(user, login.token)){
            setUpdateValueAPI(login.token);
            let hold = {...update};
            hold.update = true;
            setUpdate(hold);
        }
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
                <UpdateContext.Provider value={{update, setUpdate}}>
                    <ExtrasContext.Provider value={{extras, setExtras}}>
                    <CssBaseline />
                    <Header user={user} onPageChange={handlePageChange}/>
                        { pageState === 0 ? <HomePage />: null}
                        { pageState === 1 ? <InfoPage info={info} /> : null}
                        { pageState === 2 ? <ContactPage /> : null}
                        { pageState === 3 && login.token == 0 ? <LoginPage /> : null}
                        { pageState === 4 && login.token != 0 ? <AdminPage info={info} handleInfoChange={handleInfoChange} user={user} setUserHandler={handleUserChange} currentTheme={currentTheme} handleThemeChange={handleThemeChange} /> : null}
                        { pageState === 5 && login.token != 0 && extras ? <ExtrasPage /> : null}
                    </ExtrasContext.Provider>    
                </UpdateContext.Provider>
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
