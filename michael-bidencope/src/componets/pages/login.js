import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert } from "@mui/material";

import {getToken} from '../../api.js';
import {saveLoginState} from '../../localStorage.js';
import {LoginContext} from '../../App.js';

import jwt_decode from "jwt-decode";

import {useState, useContext} from 'react';


function LoginPage({}) {
    //before login is clicked, result is 0, after login is clicked, result remains 0 unless unsuccessful
    const [result, setResult] = useState(0);
    const { login ,setLogin} = useContext(LoginContext);
    const handleSubmit = (event, setResult) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let token = getToken(data.get("username"), data.get("password"));
        token.then((data) => {token = data;
            if (token != 0){
                //TODO need to add admin data to response data
                let tokenData = jwt_decode(token);
                let admin = tokenData.admin==1?true:false;
                setLogin({token: token, admin: admin, username: tokenData.sub, id: tokenData.id, exp: tokenData.exp});
                saveLoginState(token);
            } 
            else{
                //display error message
                setResult(1);
            }
        });
    };

    return (
        <Box p={2} m={0} sx={{'backgroundColor':'background.default', height: 'fit-content', minHeight:'100%', overflow:''}}>

            <Container component="main" maxWidth="xs">
                
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        bgcolor: 'secondary.main',
                        p: 2,
                        borderRadius: 1,
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{pb:2}}>
                        Sign in
                    </Typography>
                    
                    {result == 1 && <Alert severity="error">Invalid username or password </Alert>}

                    <Box component="form" onSubmit={(event) =>{ handleSubmit(event,setResult)}} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="Username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>

                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
export { LoginPage }