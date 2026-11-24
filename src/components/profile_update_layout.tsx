import { Stack, TextField, Button, Typography } from '@mui/material';
import { useEffect, useState, type ChangeEvent } from 'react';
import Database from '../database/supabase_db';
import { useLocation } from 'react-router';
import type { UserProfile } from '../models/profile_model';
import ShowSnackBar from './snackbar';

function UpdateProfile() {
    const db = new Database();
    const location = useLocation();
    const profile: UserProfile = location.state;
    const [newName, setNewName] = useState<string>(profile.name);
    const [newPhone, setNewPhone] = useState<number>(
        Number(profile.phone_number)
    );
    const [newPhoto, setNewPhoto] = useState<File | null>(null);
    const [msg, setMsg] = useState<string>('');
    const [showSnackbar, setShowsnackbar] = useState<boolean>(false);

    const handleUploadProfilePhoto = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files;
        if (file !== null && file.length > 0) {
            setNewPhoto(file[0]);
        }
    };
    const handleUpdate = async () => {
        //check if both number and name are filled
        if (!newName || !newPhone) {
            return setMsg("Name and Phone Number can't be empty");
        }
        const response = await db.updateCounsellorProfile({
            name: newName,
            phone_number: String(newPhone),
            photo: newPhoto,
        });
        return setMsg(response);
    };

    useEffect(() => {
        if (msg) {
            setShowsnackbar(true);
        }
    }, [msg]);

    return (
        <>
            <Stack spacing={2} sx={{ padding: '2%' }}>
                <Typography>Update one or more details</Typography>
                <TextField
                    required
                    helperText="New Name"
                    type="text"
                    value={newName}
                    onChange={(v) => setNewName(v.target.value)}
                />
                <TextField
                    required
                    type="number"
                    helperText="New Phone Number"
                    value={newPhone}
                    onChange={(v) => setNewPhone(Number(v.target.value))}
                />
                <TextField
                    type="file"
                    helperText="Select profile photo"
                    onChange={handleUploadProfilePhoto}
                />

                <Stack direction={'row'}>
                    <Button onClick={handleUpdate}>Update</Button>
                </Stack>
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

export default UpdateProfile;
