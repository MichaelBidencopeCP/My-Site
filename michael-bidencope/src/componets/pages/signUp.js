import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert } from "@mui/material";

import {LoginContext} from '../../App.js';

import {useState, useContext} from 'react';
import { createUser } from "../../api.js";
import { BackupButton } from "../components/backupButtons.js";

function SignUp({}) {

    //before login is clicked, result is 0, after login is clicked, result remains 0 unless unsuccessful
    const [result, setResult] = useState(0);
    const { login ,setLogin} = useContext(LoginContext);
    const handleSubmit = (event, setResult) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');
        const confirmPassword = data.get('confirmPassword');
        if(password != confirmPassword){
            setResult(1);
            return;
        }
        createUser(username, password).then((response) => {
            if(response == 200){
                setResult(4);
            }
            else if(response == 409){
                setResult(2);
            }
            else{
                setResult(3);
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
                        Sign Up
                    </Typography>
                    <Typography component="p1" variant="p1" sx={{pb:2}}>
                        You can create an account here, it is a simple login system for the project. Little functionality is available, but you can create an account and login.
                    </Typography>
                    
                    { result == 1 && <Alert severity="error"> Passwords do not match </Alert> }
                    { result == 2 && <Alert severity="error"> Username already exists </Alert> }
                    { result == 3 && <Alert severity="error"> Error creating account </Alert> }
                    { result == 4 && <Alert severity="success" sx={{marginBottom:2}}> Account created, go to login page to login </Alert> }
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="current-password"
                        />
                        
                        <BackupButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </BackupButton>

                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export {SignUp};