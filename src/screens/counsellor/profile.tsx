import { Button, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import Database from '../../database/supabase_db';
import type { UserProfile } from '../../models/profile_model';

function ProfilePage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const db = new Database();

    const handleViewProfile = () => {
        navigate('', {
            state: profile,
        });
    };

    const handleUpdateProfile = () => {
        navigate('update', { state: profile });
    };

    //fetch profile
    useEffect(() => {
        const getProfile = async () => {
            const res = await db.fetchCounsellorById();
            if (typeof res === 'string') {
                return window.alert(res);
            }
            setProfile(res);
        };
        getProfile();
    }, []);

    return (
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
        </>
    );
}

export default ProfilePage;
