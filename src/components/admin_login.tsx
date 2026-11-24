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
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ShowSnackBar from './snackbar';

function AdminLogin() {
    const navigate = useNavigate();
    const adminUrl = import.meta.env.VITE_ADMIN_URL;
    const db = new Database();
    const [adminEmail, setAdminEmail] = useState<string>('');
    const [adminPassword, setAdminPassword] = useState<string>('');
    const [adminTotp, setAdminTotp] = useState<string>('');
    const [otpFieldEnabled, setOtpFieldEnabled] = useState<boolean>(false);
    const [attemptingLogin, setAttemptingLogin] = useState<boolean>(false);
    const [passwordVisible, setpasswordVisible] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>('');
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

    //admin login method
    const handleAdminLogin = async () => {
        if (adminEmail.trim().length === 0) {
            return setMsg('Email is required');
        }
        if (adminPassword.trim().length === 0) {
            return setMsg('Password is required');
        }

        const body = {
            email: adminEmail,
            password: adminPassword,
        };

        const response = await axios.post(`${adminUrl}/login`, body, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.status !== 200) {
            return setMsg(response.statusText);
        }
        const token: string = response.data['token'];

        setAttemptingLogin(true);
        try {
            const response = await axios.get(`${adminUrl}/verification`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setAttemptingLogin(false);
                setOtpFieldEnabled(true);
                return setMsg(response.data['message']);
            }
            setAttemptingLogin(false);
            return setMsg(response.statusText.split(':')[1]);
        } catch (err) {
            setAttemptingLogin(false);
            return setMsg(String(err).split(':')[1]);
        }
    };

    const handleVerification = async (code: string) => {
        const token = await db.getToken();
        const response = await axios.post(
            `${adminUrl}/verify-code/${code}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            const isVerified: boolean = response.data['verified'];
            if (isVerified) {
                setMsg('Verified...');
                navigate('dashboard');
                return;
            } else {
                return setMsg('Invalid or expired code.');
            }
        }
        return setMsg(response.statusText);
    };

    useEffect(() => {
        if (msg) {
            setOpenSnackbar(true);
        }
    }, [msg]);

    return (
        <>
            <Stack
                spacing={3}
                sx={{
                    paddingLeft: '10%',
                    paddingRight: '10%',
                    paddingTop: '5%',
                }}
            >
                <Typography sx={{ color: 'blue', fontStyle: 'oblique' }}>
                    Use your admin credentials to proceed
                </Typography>
                <TextField
                    required
                    value={adminEmail}
                    type="email"
                    onChange={(v) => setAdminEmail(v.target.value)}
                    label="Admin Email"
                />
                <TextField
                    required
                    value={adminPassword}
                    type={passwordVisible ? 'text' : 'password'}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <IconButton
                                    onClick={() =>
                                        setpasswordVisible(!passwordVisible)
                                    }
                                >
                                    {passwordVisible ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            ),
                        },
                    }}
                    onChange={(v) => setAdminPassword(v.target.value)}
                    label="Admin Password"
                />

                <Typography variant="subtitle2" sx={{ fontSize: '70%' }}>
                    Login with email and password to receive verfication code
                </Typography>

                <TextField
                    required
                    disabled={!otpFieldEnabled}
                    value={adminTotp}
                    type="number"
                    sx={{
                        backgroundColor: otpFieldEnabled ? 'orange' : null,
                    }}
                    onChange={(v) => setAdminTotp(v.target.value)}
                    label="Enter Verification Code"
                />

                <Stack
                    spacing={'5%'}
                    direction={'row'}
                    sx={{ marginTop: '2%' }}
                >
                    {attemptingLogin ? (
                        <CircularProgress
                            color="secondary"
                            aria-label="Signing In"
                        />
                    ) : (
                        <Button
                            disabled={otpFieldEnabled}
                            onClick={() => handleAdminLogin()}
                        >
                            Login
                        </Button>
                    )}

                    <Button
                        variant="contained"
                        disabled={!otpFieldEnabled}
                        onClick={() => handleVerification(adminTotp.toString())}
                    >
                        Verify Code
                    </Button>

                    <Button onClick={() => navigate('/')}>Back</Button>
                </Stack>
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

export default AdminLogin;
