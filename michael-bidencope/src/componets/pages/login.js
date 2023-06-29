import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import {getToken} from '../../api.js';
function LoginPage() {

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(getToken(data.get("username"), data.get("password")));

        console.log({
            email: data.get("username"),
            password: data.get("password"),
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
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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