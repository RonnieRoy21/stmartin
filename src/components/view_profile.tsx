import {
    Avatar,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import { ImageNotSupported } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import ShowSnackBar from './snackbar';
import Database from '../database/supabase_db';
import type { UserProfile } from '../models/profile_model';

function ViewProfile() {
    const db = new Database();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [msg, setMsg] = useState<string>('');
    const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
    const [showSnackBar, setShowSnackBar] = useState<boolean>(false);

    const handleGetProfile = async () => {
        setIsLoadingProfile(true);
        const response = await db.fetchCounsellorById();

        if (typeof response === 'string') {
            setMsg(response);
            setIsLoadingProfile(false);
            return;
        }

        setIsLoadingProfile(false);
        setProfile(response);
    };

    useEffect(() => {
        handleGetProfile();
    }, []);

    useEffect(() => {
        if (msg) {
            setShowSnackBar(true);
        }
    }, [msg]);

    return (
        <>
            {isLoadingProfile ? (
                <CircularProgress sx={{ alignSelf: 'center' }} />
            ) : (
                <Stack spacing={2} sx={{ padding: '2%' }}>
                    {profile === null ? (
                        <>
                            <Typography> Profile not retrieved</Typography>
                        </>
                    ) : (
                        <Card sx={{ marginTop: '1%', color: 'orange' }}>
                            <Stack>
                                {profile.profile_photo_url ? (
                                    <Avatar
                                        variant="circular"
                                        sx={{
                                            alignSelf: 'center',
                                            width: '200px',
                                            height: '200px',
                                        }}
                                        src={profile.profile_photo_url}
                                    />
                                ) : (
                                    <ImageNotSupported />
                                )}
                                <CardContent>
                                    <Typography>
                                        Name: {profile.name}
                                    </Typography>
                                    <Typography>
                                        Email: {profile.email}
                                    </Typography>
                                    <Typography>
                                        Phone Number:{' '}
                                        {'0' + profile.phone_number}
                                    </Typography>
                                    <Typography>
                                        Registered as: {profile.role}
                                    </Typography>
                                </CardContent>
                            </Stack>
                        </Card>
                    )}
                </Stack>
            )}
            <ShowSnackBar
                open={showSnackBar}
                message={msg}
                close={() => {
                    setShowSnackBar(false);
                    setMsg('');
                }}
            />
        </>
    );
}

export default ViewProfile;
