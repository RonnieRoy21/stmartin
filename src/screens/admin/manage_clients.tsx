import axios from 'axios';
import { useState, useEffect } from 'react';
import DisplayClients from '../../components/display_clients';
import Database from '../../database/supabase_db';
import type { ClientModel } from '../../models/client_model';
import {
    Button,
    CircularProgress,
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
import { DeleteForever, Edit, Warning } from '@mui/icons-material';
import ShowSnackBar from '../../components/snackbar';

function ManageClients() {
    const db = new Database();
    const adminUrl = import.meta.env.VITE_ADMIN_URL;
    const [uploadedClients, setUploadedClients] = useState<ClientModel[]>([]);
    const [isLoadingClients, setIsLoadingclients] = useState<boolean>(false);
    const [openNewClientDialog, setOpenNewClientDialog] =
        useState<boolean>(false);
    const [openDeleteClientDialog, setOpenDeleteClientDialog] =
        useState<boolean>(false);
    const [openEditClientDialog, setOpenEditClientDialog] =
        useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedGender, setSelectedGender] = useState<string>('');
    const [selectedAge, setSelectedAge] = useState<number>();
    const [selectedName, setSelectedName] = useState<string>('');
    const [selectedIssue, setSelectedIssue] = useState<string>('');
    const [newName, setNewName] = useState<string>('');
    const [newAge, setNewAge] = useState<number>(12);
    const [newIssue, setNewIssue] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>('');
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
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
            return setMsg('Missing Fields');
        }
        if (selectedAge < 13) {
            return setMsg('Age should be 13 or above');
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

        if (response.status === 200) {
            return setMsg('Client data Uploaded');
        }
        return setMsg(response.statusText);
    };

    const handleDeleteClient = async (id: string) => {
        //delete logic
        setIsDeleting(true);
        const token = await db.getToken();

        setIsDeleting(true);
        const response = await axios.delete(
            `${adminUrl}/clients/delete/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setIsDeleting(false);
        setOpenDeleteClientDialog(false);
        return setMsg(
            response.status === 200 ? response.data : response.statusText
        );
    };
    const handleEditClient = async (id: string) => {
        //edit logic
        setIsUpdating(true);

        const token = await db.getToken();
        if (!newName || !newAge || !newIssue) {
            return setMsg('Missing fields required');
        }
        const body = {
            new_name: newName,
            new_age: newAge,
            new_issue: newIssue,
        };

        await axios
            .put(`${adminUrl}/clients/update/${id}`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setIsUpdating(false);
                setMsg(
                    response.status === 200
                        ? response.data
                        : response.statusText
                );
            })
            .catch((error) => {
                setIsUpdating(false);
                setMsg(error.message);
            })
            .finally(() => {
                setOpenEditClientDialog(false);
            });
    };
    //fetch clients method
    const fetchClients = async () => {
        const token = await db.getToken();
        setIsLoadingclients(true);
        const { data, status, statusText } = await axios.get(
            `${adminUrl}/clients/all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        setIsLoadingclients(false);
        if (status === 200) {
            setUploadedClients(data);
            return;
        }
        setMsg(statusText);
    };

    //useEfect method
    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (msg) {
            setOpenSnackbar(true);
        }
    }, [msg]);
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
                            label="Client Age (13 and above)"
                            type="number"
                            value={selectedAge}
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
            {isLoadingClients ? (
                <CircularProgress sx={{ alignSelf: 'center' }} />
            ) : uploadedClients.length > 0 ? (
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
                                        spacing={'10%'}
                                    >
                                        <IconButton
                                            onClick={() =>
                                                setOpenDeleteClientDialog(true)
                                            }
                                        >
                                            {/**delete uploaded client */}
                                            <DeleteForever />
                                        </IconButton>
                                        <Dialog
                                            open={openDeleteClientDialog}
                                            onClose={() =>
                                                setOpenDeleteClientDialog(false)
                                            }
                                        >
                                            <DialogTitle>
                                                <Warning>Delete Client</Warning>
                                            </DialogTitle>
                                            <DialogContent>
                                                <Typography>
                                                    Are you sure you want to
                                                    delete this client?
                                                </Typography>
                                            </DialogContent>
                                            <DialogActions
                                                sx={{
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                {isDeleting ? (
                                                    <CircularProgress />
                                                ) : (
                                                    <Button
                                                        onClick={() =>
                                                            handleDeleteClient(
                                                                c.id
                                                            )
                                                        }
                                                    >
                                                        Yes
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() =>
                                                        setOpenDeleteClientDialog(
                                                            false
                                                        )
                                                    }
                                                >
                                                    No
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                        <IconButton
                                            onClick={() => {
                                                setNewAge(c.age);
                                                setNewName(c.name);
                                                setNewIssue(c.presenting_issue);
                                                setOpenEditClientDialog(true);
                                            }}
                                        >
                                            {/**edit uploaded client */}
                                            <Edit />
                                        </IconButton>
                                        <Dialog
                                            open={openEditClientDialog}
                                            onClose={() =>
                                                setOpenEditClientDialog(false)
                                            }
                                        >
                                            <DialogTitle>
                                                <Edit>Edit Client Details</Edit>
                                            </DialogTitle>

                                            <DialogContent>
                                                <Stack spacing={'3%'}>
                                                    <TextField
                                                        helperText="Name"
                                                        value={newName}
                                                        onChange={(e) =>
                                                            setNewName(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <TextField
                                                        helperText="Age"
                                                        value={newAge}
                                                        onChange={(e) =>
                                                            setNewAge(
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                    />
                                                    <TextField
                                                        helperText="Issue"
                                                        value={newIssue}
                                                        onChange={(e) =>
                                                            setNewIssue(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <TextField
                                                        disabled
                                                        helperText="Gender"
                                                        value={c.gender}
                                                    />
                                                    <TextField
                                                        disabled
                                                        helperText="Occupation"
                                                        value={c.occupation}
                                                    />
                                                </Stack>
                                            </DialogContent>
                                            <DialogActions>
                                                {isUpdating ? (
                                                    <CircularProgress />
                                                ) : (
                                                    <Button
                                                        onClick={() =>
                                                            handleEditClient(
                                                                c.id
                                                            )
                                                        }
                                                    >
                                                        {' '}
                                                        Confirm
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() =>
                                                        setOpenEditClientDialog(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </Stack>
                                </Paper>
                            </>
                        );
                    })}
                </List>
            ) : (
                <Typography>No Clients yet.</Typography>
            )}
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

export default ManageClients;
