import axios from 'axios';
import { useState, useEffect } from 'react';
import DisplayClients from '../../components/display_clients';
import Database from '../../database/supabase_db';
import type { ClientModel } from '../../models/client_model';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputLabel,
    List,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { DeleteForever, Edit } from '@mui/icons-material';

function ManageClients() {
    const db = new Database();
    const adminUrl = import.meta.env.VITE_ADMIN_URL;
    const [uploadedClients, setUploadedClients] = useState<ClientModel[]>([]);
    const [openNewClientDialog, setOpenNewClientDialog] =
        useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedGender, setSelectedGender] = useState<string>('');
    const [selectedAge, setSelectedAge] = useState<number>(12);
    const [selectedName, setSelectedName] = useState<string>('');
    const [selectedIssue, setSelectedIssue] = useState<string>('');
    const occupations: string[] = ['student', 'dropout', 'working-class'];
    const genders: string[] = ['male', 'female'];

    const handleClientUpload = async () => {
        if (
            !selectedAge ||
            !selectedCategory ||
            !selectedGender ||
            !selectedIssue ||
            !selectedName
        ) {
            return window.alert('Missing Fields');
        }
        const body = {
            age: selectedAge,
            name: selectedName,
            gender: selectedGender,
            occupation: selectedCategory,
            presenting_issue: selectedIssue,
        };
        const token = await db.getToken();
        const response = await axios.post(`${adminUrl}/clients/upload`, body, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Response: ' + response);

        if (response.status === 200) {
            return window.alert('Client data Uploaded');
        }
        return window.alert(response.statusText);
    };

    //fetch clients method
    const fetchClients = async () => {
        const token = await db.getToken();
        const { data, status, statusText } = await axios.get(
            `${adminUrl}/clients/all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (status === 200) {
            setUploadedClients(data);
            return;
        }
        window.alert(statusText);
    };

    //useEfect method
    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <>
            <Button
                variant={'contained'}
                onClick={() => setOpenNewClientDialog(true)}
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 20,
                }}
            >
                New
            </Button>
            <Dialog
                open={openNewClientDialog}
                onClose={() => setOpenNewClientDialog(false)}
            >
                <DialogTitle>Clients Data</DialogTitle>
                <DialogContent sx={{ margin: '2%' }}>
                    <Stack spacing={'5%'}>
                        <TextField
                            error={selectedName.trim().length === 0}
                            required
                            label="Client Name"
                            value={selectedName}
                            onChange={(e) => setSelectedName(e.target.value)}
                        />

                        <TextField
                            required
                            label="Client Age (12 and above)"
                            type="number"
                            value={selectedAge < 12 ? 12 : selectedAge}
                            onChange={(e) =>
                                setSelectedAge(Number(e.target.value))
                            }
                        />

                        <InputLabel>Category</InputLabel>
                        <Select
                            error={selectedCategory.trim().length === 0}
                            required
                            hiddenLabel={false}
                            label="Category"
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                        >
                            {occupations.map((o, index) => {
                                return (
                                    <MenuItem key={index} value={o}>
                                        {o}
                                    </MenuItem>
                                );
                            })}
                        </Select>

                        <InputLabel>Gender</InputLabel>
                        <Select
                            error={selectedGender.trim().length === 0}
                            required
                            label="Gender"
                            value={selectedGender}
                            onChange={(e) => setSelectedGender(e.target.value)}
                        >
                            {genders.map((g, index) => {
                                return (
                                    <MenuItem key={index} value={g}>
                                        {g}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        <TextField
                            error={selectedIssue.trim().length === 0}
                            required
                            label="Presenting Issue"
                            value={selectedIssue}
                            onChange={(e) => setSelectedIssue(e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClientUpload()}>Upload</Button>
                    <Button onClick={() => setOpenNewClientDialog(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>{' '}
            {uploadedClients.length > 0 ? (
                <List sx={{ marginBottom: '10%' }}>
                    {uploadedClients.map((c, index) => {
                        return (
                            <>
                                <Paper elevation={3} sx={{ margin: '2%' }}>
                                    <DisplayClients key={index} client={c} />
                                    {c.counsellors ? (
                                        <Typography>
                                            Assigned To: {c.counsellors.name},
                                            {'0' + c.counsellors.phone_number}
                                        </Typography>
                                    ) : (
                                        <Typography>Not Assigned</Typography>
                                    )}
                                    <Stack
                                        direction={'row-reverse'}
                                        spacing={'8%'}
                                    >
                                        <IconButton>
                                            <DeleteForever />
                                        </IconButton>
                                        <IconButton>
                                            <Edit />
                                        </IconButton>
                                    </Stack>
                                </Paper>
                            </>
                        );
                    })}
                </List>
            ) : (
                <Typography>No Clients yet.</Typography>
            )}
        </>
    );
}

export default ManageClients;
