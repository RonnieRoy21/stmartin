import {
    Avatar,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import { useLocation } from 'react-router';
import type { UserProfile } from '../models/profile_model';
import { ImageNotSupported } from '@mui/icons-material';

function ViewProfile() {
    const location = useLocation();
    const profile: UserProfile = location.state;

    return (
        <>
            <Stack spacing={2} sx={{ padding: '2%' }}>
                {profile === null ? (
                    <>
                        <CircularProgress sx={{ alignSelf: 'center' }} />
                        <Typography>Loading Profile....</Typography>
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
        </>
    );
}

export default ViewProfile;
