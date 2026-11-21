import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import DisplayClients from '../../components/display_clients';
import Database from '../../database/supabase_db';
import type { ClientModel } from '../../models/client_model';
import { useEffect, useState } from 'react';
function PickClient() {
    //state variables
    const db = new Database();
    const [availableClients, setAvailableClients] = useState<ClientModel[]>([]);
    const [confirmClientSelection, setConfirmClientSelection] =
        useState<boolean>(false);

    const handleAssign = async (id: string) => {
        const response = await db.assignCounsellor(id);
        setConfirmClientSelection(false);
        return window.alert(response);
    };
    //fetch clients method
    const fetchClients = async () => {
        const clients = await db.counsellorViewClients();
        if (typeof clients === 'string') {
            return window.alert(clients);
        }

        setAvailableClients(clients);
    };

    //useeffect method
    useEffect(() => {
        fetchClients();
        console.log(availableClients);
    }, []);

    return (
        <>
            <Stack
                direction={'row'}
                spacing={'5%'}
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 20,
                    backgroundColor: 'whitesmoke',
                }}
            >
                <Typography>Filters</Typography>
                <Select label="Filter" sx={{ width: '70%' }}>
                    <MenuItem>View All</MenuItem>
                    <MenuItem>My Clients</MenuItem>
                </Select>
            </Stack>
            <List>
                {availableClients.length > 0 ? (
                    availableClients.map((c, index) => {
                        return (
                            <Paper
                                key={index}
                                elevation={3}
                                sx={{ margin: '2%', padding: '2%' }}
                            >
                                <DisplayClients client={c} />
                                <Stack direction={'row-reverse'}>
                                    {/**buttons to modify client data  */}
                                    <Button
                                        disabled={
                                            c.counsellors !== null &&
                                            c.counsellors !== undefined
                                        }
                                        variant="contained"
                                        onClick={() =>
                                            setConfirmClientSelection(true)
                                        }
                                    >
                                        Select
                                    </Button>
                                    <Dialog
                                        open={confirmClientSelection}
                                        onClose={() =>
                                            setConfirmClientSelection(false)
                                        }
                                    >
                                        <DialogTitle>
                                            This Action can't be undone
                                        </DialogTitle>
                                        <DialogContent>
                                            Please confirm your action below
                                        </DialogContent>
                                        <DialogActions>
                                            <Stack
                                                direction={'row'}
                                                spacing={'5%'}
                                            >
                                                <Button
                                                    variant="contained"
                                                    onClick={() =>
                                                        handleAssign(c.id)
                                                    }
                                                >
                                                    Confirm
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() =>
                                                        setConfirmClientSelection(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </Stack>
                                        </DialogActions>
                                    </Dialog>
                                </Stack>
                            </Paper>
                        );
                    })
                ) : (
                    <Typography>
                        {' '}
                        You have no clients assigned and none to select from
                    </Typography>
                )}
            </List>
        </>
    );
}

export default PickClient;
