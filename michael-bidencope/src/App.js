
import './App.css';
import Header from './componets/structures/header.js';
import { createTheme, ThemeProvider  } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { HomePage } from './componets/pages/home.js';
import { ContactPage } from './componets/pages/contact.js';
import { LoginPage } from './componets/pages/login.js';
import { AdminPage } from './componets/pages/admin.js';
import { useState, useEffect } from 'react';

import { getUser } from './api.js';

function App() {
    const [pageState, setPageState] = useState(0);
    const [loginState, setLoginState] = useState();
    const [user, setUser] = useState({name:'Michael Bidencope', title:'Software Engineer'});
    useEffect(() => { getUser().then((data) => {setUser({name:data.name, title:data.title});}); }, []);
    

    console.log(user.name);
    const handlePageChange = (page) => {setPageState(page);};
    
    return (
        <ThemeProvider theme={theme}>
                
                <CssBaseline />
                <Header user={user} onPageChange={handlePageChange} loginState={loginState}/>
                { pageState === 0 ? <HomePage />: null}
                { pageState === 1 ? <AdminPage /> : null}
                { pageState === 2 ? <ContactPage /> : null}
                { pageState === 3 && !loginState ? <LoginPage /> : null}

            
        </ThemeProvider>
    );
}


const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            main: '#EBEBEB',
        },
        primary: {
            main: '#4A7C59',
            contrastText: '#000000',
        },
        secondary: {
            main: '#C8D5B9',
        },
        error: {
            main: '#ffeb3b',
        },
    },
    
});


export default App;
