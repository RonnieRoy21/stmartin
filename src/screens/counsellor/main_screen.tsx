import { Outlet, useNavigate } from 'react-router';
import { Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import Database from '../../database/supabase_db';
import ShowSnackBar from '../../components/snackbar';

function MainScreen() {
    const navigate = useNavigate();
    const [msg, setMsg] = useState<string>('');
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    const handleLogout = async () => {
        const db = new Database();
        const res = await db.logoutUser();
        if (typeof res === 'boolean') {
            //log out success
            navigate('/');

            return;
        }
        setMsg(res);
    };

    useEffect(() => {
        if (msg) {
            setShowSnackbar(true);
        }
    }, [msg]);
    return (
        <Stack>
            <Outlet />
            <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                    position: 'fixed',
                    width: '100%',
                    bottom: 0,
                    zIndex: 50,
                }}
            >
                Logout
            </Button>
            <ShowSnackBar
                open={showSnackbar}
                message={msg}
                close={() => {
                    setShowSnackbar(false);
                }}
            />
        </Stack>
    );
}

export default MainScreen;
