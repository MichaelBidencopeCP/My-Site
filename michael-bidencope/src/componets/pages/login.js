import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert } from "@mui/material";

import {getToken} from '../../api.js';
import {saveLoginState} from '../../localStorage.js';

import React from 'react';

function LoginPage({handleTokenState, }) {
    //before login is clicked, result is 0, after login is clicked, result remains 0 unless unsuccessful
    const [result, setResult] = React.useState(0);
    const handleSubmit = (event, setResult) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let token = getToken(data.get("username"), data.get("password"));
        token.then((data) => {token = data;
            if (token != 0){
                handleTokenState(token);
                saveLoginState(token);
            } 
            else{
                //display error message
                setResult(1);
            }
        });
    };

    return (
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
    );
}
export { LoginPage }
//import Link from "@mui/material/Link";
//import Grid from "@mui/material/Grid";
//<Grid container>
//    <Grid item xs>
//        <Link href="#" variant="body2">
//            Forgot password?
//        </Link>
//    </Grid>
//    <Grid item>
//        <Link href="#" variant="body2">
//            {"Don't have an account? Sign Up"}
//        </Link>
//    </Grid>
//</Grid>
//import FormControlLabel from "@mui/material/FormControlLabel";
//import Checkbox from "@mui/material/Checkbox";

//<FormControlLabel
//      control={<Checkbox value="remember" color="primary" />}
//      label="Remember me"
///>