
import './App.css';
import Header from './componets/structures/header.js';
import { createTheme, ThemeProvider  } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { HomePage } from './componets/pages/home.js';
import { ContactPage } from './componets/pages/contact.js';
import { LoginPage } from './componets/pages/login.js';
import { AdminPage } from './componets/pages/admin.js';
import { InfoPage } from './componets/pages/info';
import { SignUp } from './componets/pages/signUp';
import { useState, useEffect, createContext, useMemo, useRef } from 'react';

import { getUser, postInfo, postPersonalInfo, getThemeForSite, getUpdateValue, setUpdateValueAPI, getExtrasEnabled, parseJwt } from './api.js';

import {  checkForUpdate, getLoginState, getThemeFromLocal, getUserInfoLocal, removeLoginState, saveTheme, saveUserInfo, setUpdateValue } from './localStorage.js';
import { ExtrasPage } from './componets/extras/extras';
import { UserPage } from './componets/pages/user.js';
import { PageSpinner } from './componets/structures/pageSpinner.js';
import {api} from './api.js';
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
    const [loaded, setLoaded] = useState(false);
    const [tokenExp, setTokenExp] = useState(false);
    const initialRender = useRef(true);

    //Logic for intercepting 401's and logging out the user
    useMemo(() => {
        // Handle 401 errors
        api.interceptors.response.use(
            (response) => {
                return response;
            },
            async function (error) {
                const originalRequest = error.config;
                if (error.response.status === 401 && originalRequest.headers.Authorization) {
                    console.log('401 error intercepted and silenced');
                    // Optionally, you can perform some action here, like refreshing the token
                    //logout user.
                    removeLoginState();
                    setLogin({token: 0, admin: false});
                    setTokenExp(true);
                    return Promise.resolve(); // Silences the error

                }
                return Promise.reject(error); // Propagate other errors
            }
        );
    }, [setTokenExp, setLogin]);
    useEffect(
        () => {
            if (login.token == 0){
                return;
            }
            //if(login.admin != true){ 
            //    return;
            //}
            getExtrasEnabled(login.token).then((response) => {
                response = response.response;
                setExtras(response);
            }).catch((error) => {
                console.log(error);
                console.log('expected error from 401 when not admin');
            });

        }, [login.token]
    );

    //set login from cache if token expired state will be set to logged out values
    useEffect(() => { setLogin(getLoginState()); }, []);
    
    //need to fix the issue where this is called twice
    useMemo(() => {
        //set user info from api or cache
        //invalidate cache if with update value
        getUpdateValue().then((data) => {
            if(initialRender.current){
                let updateCheck = checkForUpdate(data);
                if (updateCheck){
                    let hold = {...update}
                    hold.update = updateCheck;
                    setUpdate(hold);
                    
                }
            }
            console.log('update value:', data);
        }).then(() => {
            initialRender.current = false;

            //Theme start up logic
            //if user is logged in
            if(login.token != 0){

                //default to using api to get theme
                getThemeForSite(login.token).then((data) => {
                    setCurrentTheme(data);
                });
            }
            //no user is logged in, default to using api or cache to get theme
            else{
            
                //flag to update if cache is empty
                let flagToUpdateTheme = false;
                if(update.update === false){
            
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
                if(update.update || flagToUpdateTheme){
                    if(update.updatedProjects == false){
                        getThemeForSite(login.token).then((data) => {
                            setCurrentTheme(data);
                            saveTheme(data, login.id);
                            let hold = {...update};
                            hold.updatedTheme = true;
                            setUpdate(hold);
                        });
                    }
                }
            }
            //User info start up logic
            //flag to update if cache is empty for user info
            let updateFlag = false;
            if(update.update === false){
                //try to get cache data
                let data = getUserInfoLocal()
                if(data){
                    setUser({name:data.name, title:data.title,email:data.email ,city:data.city, state:data.state});
                    setInfo({bio:data.bio});
                }
                else{
                    //if cache is empty set flag to update
                    updateFlag = true;
                }
            }
            //if admin has updated the database or the cache is empty update the cache
            if(update.update || updateFlag){ 
                getUser().then((data) => {
                    
                    setUser({name:data.name, title:data.title,email:data.email ,city:data.city, state:data.state});
                    setInfo({bio:data.bio})
                    //save user info to cache
                    saveUserInfo({name:data.name, title:data.title,email:data.email ,city:data.city, state:data.state, bio:data.bio})
                        
                    if(update.updatedUserInfo == true){
                        let hold = {...update}
                        hold.updatedUserInfo = false;
                        setUpdate(hold);
                    }
                });
            }
        }).then(() => {
            setTimeout(() => {
            setLoaded(true);
            }, 750);
        });

        
    }, [ update.update]);
    
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
        //check the theme
        if(login.token != 0){
            getThemeForSite(login.token).then((data) => {
                setCurrentTheme(data);
            });
        }
        
        setPageState(0);
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
                    { !loaded ? <PageSpinner />: null}
                    <Header user={user} onPageChange={handlePageChange}/>
                        { tokenExp === 1 ? <h1>Token Expired</h1> : null}
                        { pageState === 0 ? <HomePage tokenExp={tokenExp}/>: null}
                        { pageState === 1 ? <InfoPage info={info} /> : null}
                        { pageState === 2 ? <ContactPage user={user}/> : null}
                        { pageState === 3 && login.token == 0 ? <LoginPage onPageChange={handlePageChange}/> : null}
                        { pageState === 4 && login.token != 0 ? <AdminPage info={info} handleInfoChange={handleInfoChange} user={user} setUserHandler={handleUserChange} currentTheme={currentTheme} handleThemeChange={handleThemeChange} /> : null}
                        { pageState === 5 && login.token != 0 && extras ? <ExtrasPage /> : null}
                        { pageState === 6 ? <SignUp /> : null}
                        { pageState === 7 && login.token != 0 ? <UserPage currentTheme={currentTheme} handleThemeChange={handleThemeChange} /> : null}
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
