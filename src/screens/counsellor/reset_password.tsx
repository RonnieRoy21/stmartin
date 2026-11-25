import {
    Button,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ShowSnackBar from '../../components/snackbar';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function ResetPassword() {
    const navigate = useNavigate();
    const resetPasswordUrl = import.meta.env.VITE_RESET_PASSWORD_URL;
    const [email_address, setEmailAddress] = useState<string>();
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [passVisible, setPassVisible] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>('');
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>('');
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    const handlePasswordResetCode = async () => {
        if (!email_address) {
            return setMsg('Email is required');
        }
        const body = { email: email_address };
        await axios
            .post(
                `${resetPasswordUrl}/request-reset-password`,
                {},
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    params: body,
                }
            )
            .then((response) => {
                console.log(response);
                setMsg(response.data);
                setIsCodeSent(true);
            })
            .catch((error) => {
                setMsg(String(error));
            });
    };

    const handleChangePassword = async () => {
        //check code,new pass and email are not empty
        if (!email_address || !verificationCode || !newPassword) {
            setMsg('Fill all missing fields');
            return;
        }
        if (newPassword.length < 6) {
            setMsg('Password too short');
            return;
        }

        await axios
            .post(
                `${resetPasswordUrl}/change-password`,
                {},

                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: {
                        email: email_address,
                        verification_code: verificationCode,
                        newPass: newPassword,
                    },
                }
            )
            .then((response) => {
                setMsg(response.data);
            })
            .catch((error) => {
                setMsg(String(error));
            });
    };

    useEffect(() => {
        if (msg) {
            setShowSnackbar(true);
        }
    }, [msg]);

    return (
        <>
            <Stack sx={{ margin: '5%' }} spacing={3}>
                <Typography> Enter the email to your acoount.</Typography>
                <TextField
                    label="Enter Your Email"
                    type="email"
                    value={email_address}
                    onChange={(e) => {
                        setEmailAddress(e.target.value);
                    }}
                />
                <TextField
                    disabled={!isCodeSent}
                    label="Verification code"
                    type="number"
                    value={verificationCode}
                    onChange={(e) => {
                        setVerificationCode(e.target.value);
                    }}
                />
                <TextField
                    disabled={!isCodeSent}
                    label="New Password"
                    type={passVisible ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                    }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <IconButton
                                    disabled={!isCodeSent}
                                    onClick={() => setPassVisible(!passVisible)}
                                >
                                    {passVisible ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            ),
                        },
                    }}
                />
                {msg ? <Typography>{msg}</Typography> : null}
            </Stack>

            <Stack
                direction={'row'}
                sx={{
                    marginTop: '5%',
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    variant="contained"
                    onClick={handlePasswordResetCode}
                    sx={{ fontSize: '70%' }}
                >
                    Send Reset Code
                </Button>
                <Button
                    disabled={!isCodeSent}
                    variant="contained"
                    onClick={handleChangePassword}
                    sx={{ fontSize: '70%' }}
                >
                    {' '}
                    Change Password
                </Button>
            </Stack>
            <Button
                onClick={() => {
                    navigate('/');
                }}
            >
                Back to login
            </Button>
            <ShowSnackBar
                open={showSnackbar}
                message={msg}
                close={() => setShowSnackbar(false)}
            />
        </>
    );
}

export default ResetPassword;
