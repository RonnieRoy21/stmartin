import {
    Button,
    CircularProgress,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Database from '../database/supabase_db';
import SaintMartinLogo from '../assets/Saint_Martin_Logo-01-150x150.svg';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import ShowSnackBar from './snackbar';

const textFieldStyles = {
    marginLeft: '10%',
    marginRight: '10%',
    marginBottom: '2%',
};

function LoginForm() {
    const [email, setEmail] = useState<string>('');
    const [passwd, setPasswd] = useState<string>('');
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [isSigningIn, setIsSigninIn] = useState<boolean>(false);

    const navigate = useNavigate();
    const db = new Database();
    const [msg, setMsg] = useState<string>('');
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

    const handleLogin = async () => {
        if (email.trim().length === 0 || passwd.trim().length === 0) {
            return window.alert('Please enter email and password');
        }
        setIsSigninIn(true);
        const response = await db.loginCounsellor(email, passwd);
        setIsSigninIn(false);

        //if response is a string its an error msg
        if (typeof response === 'string') {
            return setMsg(response);
        }

        setMsg('Login Success');
        navigate('/home');
    };

    useEffect(() => {
        if (msg) {
            setOpenSnackbar(true);
            return;
        }
    }, [msg]);
    return (
        <>
            <Stack
                sx={{
                    height: '100%',
                    backgroundColor: 'whitesmoke',
                }}
            >
                <Stack
                    spacing={'20%'}
                    sx={{
                        paddingLeft: '30%',
                        paddingRight: '30%',
                        paddingTop: '2%',
                    }}
                >
                    <img
                        src={SaintMartinLogo}
                        width={'50%'}
                        height={'50%'}
                        alt="St Martin Logo"
                    />
                </Stack>
                <Typography variant="subtitle2" sx={{ paddingBottom: '2%' }}>
                    Welcome To St Martin Counsellors
                </Typography>
                <Typography variant="subtitle1">Login to proceed</Typography>

                <TextField
                    required
                    id="emailController"
                    type="email"
                    variant="outlined"
                    label="Your email"
                    value={email}
                    onChange={(newValue) => setEmail(newValue.target.value)}
                    sx={textFieldStyles}
                />
                <TextField
                    required
                    slotProps={{
                        input: {
                            endAdornment: (
                                <IconButton
                                    onClick={() =>
                                        setPasswordVisible(!passwordVisible)
                                    }
                                >
                                    {passwordVisible ? (
                                        <VisibilityOffIcon />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            ),
                        },
                    }}
                    id="passwordController"
                    type={passwordVisible ? 'text' : 'password'}
                    label="password"
                    variant="outlined"
                    value={passwd}
                    onChange={(newValue) => setPasswd(newValue.target.value)}
                    sx={textFieldStyles}
                />
                <Stack
                    direction={'row'}
                    sx={{ marginLeft: '10%', marginRight: '10%' }}
                    spacing={1}
                >
                    {isSigningIn ? (
                        <CircularProgress />
                    ) : (
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: 'orange', color: 'black' }}
                            onClick={() => {
                                handleLogin();
                            }}
                        >
                            Login
                        </Button>
                    )}
                    <Button
                        variant="text"
                        sx={{ color: 'blue' }}
                        onClick={() => {
                            navigate('/signUp');
                        }}
                    >
                        Create Account
                    </Button>
                </Stack>
                <Button
                    onClick={() => {
                        navigate('/reset-password');
                    }}
                    sx={{
                        fontSize: '70%',
                    }}
                >
                    Forgot Password ?
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/admin')}
                    sx={{
                        color: 'blue',
                        marginLeft: '20%',
                        marginRight: '20%',
                        marginTop: '5%',
                        marginBottom: '5%',
                        fontStyle: 'italic',
                        fontSize: '70%',
                    }}
                >
                    Login as Admin
                </Button>
            </Stack>
            <ShowSnackBar
                open={openSnackbar}
                message={msg}
                close={() => {
                    setOpenSnackbar(false);
                    setMsg('');
                }}
            />
        </>
    );
}

export default LoginForm;
