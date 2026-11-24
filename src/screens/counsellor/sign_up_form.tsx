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
import Database from '../../database/supabase_db';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ShowSnackBar from '../../components/snackbar';

const textFieldStyles = {
    marginLeft: '15%',
    marginRight: '15%',
    marginBottom: '2%',
    maxWidth: '80%',
    minWidth: '50%',
};
const db = new Database();
function SignUpForm() {
    const navigate = useNavigate();

    // fields for sign up values
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<number>(0);
    const [password, setPassword] = useState<string>('');
    const [nameErr, setNameErr] = useState<boolean>(false);
    const [emailErr, setEmailErr] = useState<boolean>(false);
    const [phoneErr, setPhoneErr] = useState<boolean>(false);
    const [passwdErr, setPasswdErr] = useState<boolean>(false);

    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [isSigningUp, setIsSigninUp] = useState<boolean>(false);

    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>('');

    const handleSignUp = async () => {
        if (!name) {
            setNameErr(true);
            return;
        }
        if (!email) {
            setEmailErr(true);
            return;
        }
        if (phoneNumber.toString().trim().length < 9) {
            setPhoneErr(true);
            return;
        }
        if (password.trim().length < 6) {
            setPasswdErr(true);
            return;
        }
        setNameErr(false);
        setEmailErr(false);
        setPhoneErr(false);
        setPasswdErr(false);
        setIsSigninUp(true);

        const response = await db.createAccount(
            {
                name: name,
                phone_number: String(phoneNumber),
                email: email,
            },
            password
        );
        setIsSigninUp(false);
        if (typeof response === 'boolean') {
            setMsg('Sign up complete.');
            navigate('/');
            return;
        } else {
            setMsg(response);
        }
    };

    useEffect(() => {
        if (msg) {
            setOpenSnackbar(true);
        }
    }, [msg]);
    return (
        <>
            <Stack
                sx={{
                    padding: '1%',
                    height: '100%',
                    backgroundColor: 'beige',
                    backgroundBlendMode: 'saturation',
                }}
            >
                <Typography
                    sx={{
                        color: 'blue',
                    }}
                >
                    Create an Account
                </Typography>
                <TextField
                    required
                    error={nameErr}
                    id="nameController"
                    type="text"
                    variant="outlined"
                    label="Your Full Name"
                    onChange={(newText) => setName(newText.target.value)}
                    prefix="password"
                    sx={textFieldStyles}
                />
                <TextField
                    required
                    error={emailErr}
                    id="emailController"
                    type="email"
                    variant="outlined"
                    label="Your Email"
                    onChange={(newMail) => setEmail(newMail.target.value)}
                    sx={textFieldStyles}
                />

                <TextField
                    required
                    error={phoneErr}
                    id="phoneController"
                    type="number"
                    variant="outlined"
                    label="Your Phone Number "
                    onChange={(newPhone) =>
                        setPhoneNumber(Number(newPhone.target.value))
                    }
                    sx={textFieldStyles}
                />
                <TextField
                    required
                    error={passwdErr}
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
                                        <VisibilityIcon />
                                    )}
                                </IconButton>
                            ),
                        },
                    }}
                    id="passwordController"
                    type={passwordVisible ? 'text' : 'password'}
                    label="Password "
                    helperText="At least 6 characters"
                    variant="outlined"
                    onChange={(newPass) => setPassword(newPass.target.value)}
                    sx={textFieldStyles}
                />

                {isSigningUp ? (
                    <CircularProgress sx={{ alignSelf: 'center' }} />
                ) : (
                    <Button
                        variant="outlined"
                        sx={{
                            marginLeft: '40%',
                            marginRight: '40%',
                            color: 'blue',
                            backgroundColor: 'orange',
                        }}
                        onClick={() => {
                            handleSignUp();
                        }}
                    >
                        Done
                    </Button>
                )}

                {
                    <Button
                        disabled={isSigningUp}
                        variant="outlined"
                        onClick={() => navigate('/')}
                        sx={{
                            color: 'blue',
                            marginLeft: '10%',
                            marginRight: '10%',
                            marginTop: '5%',
                            marginBottom: '5%',
                            fontStyle: 'italic',
                            fontSize: '70%',
                        }}
                    >
                        {' '}
                        Back to login
                    </Button>
                }
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

export default SignUpForm;
