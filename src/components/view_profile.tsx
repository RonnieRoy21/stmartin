import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router';
import type { UserProfile } from '../models/profile_model';
import { ImageNotSupported } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import ShowSnackBar from './snackbar';

function ViewProfile() {
    const location = useLocation();
    const profile: UserProfile = location.state;
    const [msg, setMsg] = useState<string>('');
    const [showSnackBar, setShowSnackBar] = useState<boolean>(false);

    if (!profile) {
        setMsg('Error fetching profile');
    }

    useEffect(() => {
        if (msg) {
            setShowSnackBar(true);
        }
    }, [msg]);

    return (
        <>
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
                                <Typography>Name: {profile.name}</Typography>
                                <Typography>Email: {profile.email}</Typography>
                                <Typography>
                                    Phone Number: {'0' + profile.phone_number}
                                </Typography>
                                <Typography>
                                    Registered as: {profile.role}
                                </Typography>
                            </CardContent>
                        </Stack>
                    </Card>
                )}
            </Stack>
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
