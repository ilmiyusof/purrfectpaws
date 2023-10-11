import { SetStateAction, useState } from 'react'
import './login.css'
import Button from '@mui/material/Button';
import { Avatar, Box, Grid, Link, Paper, TextField, Typography } from '@mui/material';
import logo from './assets/logo.jpg';
import { login } from './service/api';
import { validateEmailPattern } from './common/commonFunctions';
import CssBaseline from '@mui/material/CssBaseline';
import image from './assets/cats.jpg'
import jwt_decode from "jwt-decode";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleUsernameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setUsername(event.target.value);
        setUsernameError('');
        setErrorMessage('')
    };

    const handlePasswordChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setPassword(event.target.value);
        setPasswordError('');
        setErrorMessage('');
    };

    const onClickSignUp = (url: string) => {
        window.location.href = url;
    }

    const onClickLogin = () => {
        console.log("logging in...");
        // Here you can handle the login logic, like sending the username and password to the server

        //validation
        let isUsernameValid = true;
        let isPasswordValid = true;
        let isEmailFormatValid = true;

        if (username.trim() === '') {
            setUsernameError('Please fill up username');
            isUsernameValid = false;
        } else if (!validateEmailPattern(username)) {
            setUsernameError('Invalid email format');
            isEmailFormatValid = false;
        }

        if (password.trim() === '') {
            setPasswordError('Please fill up password');
            isPasswordValid = false;
        } else {
            setPasswordError('');
        }

        if (isPasswordValid && isUsernameValid && isEmailFormatValid) {
            login(username, password)
                .then((response) => {
                    console.log(response, "reponse")
                    const token = response.data;
                    const decoded = jwt_decode<any| any>(token);
                    const userId = decoded?.UserId;
                    const role = decoded?.RoleName;
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('userId', userId);
                    sessionStorage.setItem('role', role);
                    if(role === "customer") {
                        window.location.href = "/";
                    } else {
                        window.location.href = "/inventoryList";
                    }
                }).catch((error: Error) => {
                    console.log(error, "error")
                    setErrorMessage('Invalid user credentials. Please try again.')
                })
        }
    }

    return (
        <Grid container sx={{ width: '100vw', height: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                sm={12}
                xs={false}
                md={7}
                sx={{
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={4} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        mt: 18,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar src={logo} sx={{ width: 250, height: 200 }} />
                    <Typography mb={3} component="h1" variant="h5" sx={{ color: "#F070AC" }}>
                        Sign In
                    </Typography>
                    <form>
                        <div>
                            <TextField
                                id="username"
                                label="Username"
                                variant="outlined"
                                onChange={handleUsernameChange}
                                value={username}
                                required
                                error={usernameError !== ''}
                                helperText={usernameError}
                            />
                        </div>
                        <br />
                        <div>
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                error={passwordError !== ''}
                                helperText={passwordError}
                            />
                        </div>
                        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                        <br />
                        <Button variant="outlined" onClick={() => onClickLogin()} sx={{backgroundColor:"#ceebfa"}}>Login</Button>
                        <br />
                        <br />
                        <Link href="#" onClick={() => onClickSignUp('/signup')}>{"Don't have an account? Sign Up"}</Link>
                    </form>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login
