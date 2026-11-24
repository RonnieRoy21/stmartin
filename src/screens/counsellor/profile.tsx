import { Button, CircularProgress, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import Database from '../../database/supabase_db';
import type { UserProfile } from '../../models/profile_model';
import ShowSnackBar from '../../components/snackbar';

function ProfilePage() {
    const navigate = useNavigate();
    const db = new Database();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>('');
    const [showSnackbar, setShowsnackbar] = useState<boolean>(false);

    const handleViewProfile = () => {
        navigate('', {
            state: profile,
        });
    };

    const handleUpdateProfile = () => {
        navigate('update', { state: profile });
    };

    const getProfile = async () => {
        setIsLoading(true);
        const res = await db.fetchCounsellorById();
        if (typeof res === 'string') {
            return setMsg(res);
        }
        setProfile(res);
        setIsLoading(false);
    };
    //fetch profile
    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        handleViewProfile();
    }, [profile]);

    useEffect(() => {
        if (msg) {
            setShowsnackbar(true);
        }
    }, [msg]);
    return isLoading ? (
        <CircularProgress sx={{ alignSelf: 'center' }} />
    ) : (
        <>
            <Stack spacing={1} sx={{ paddingTop: '1%' }}>
                <Stack
                    spacing={1}
                    direction={'row'}
                    sx={{ justifyContent: 'center' }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => handleViewProfile()}
                    >
                        View profile
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleUpdateProfile()}
                    >
                        Update profile
                    </Button>
                </Stack>
                <Outlet />
            </Stack>
            <ShowSnackBar
                open={showSnackbar}
                message={msg}
                close={() => {
                    setShowsnackbar(false);
                    setMsg('');
                }}
            />
        </>
    );
}

export default ProfilePage;
