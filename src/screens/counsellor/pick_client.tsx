import {
    Button,
    CircularProgress,
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
import ShowSnackBar from '../../components/snackbar';
function PickClient() {
    //state variables
    const db = new Database();
    const [availableClients, setAvailableClients] = useState<ClientModel[]>([]);
    const [confirmClientSelection, setConfirmClientSelection] =
        useState<boolean>(false);
    const [selectedClient, setSelectedClient] = useState<ClientModel | null>(
        null
    );
    const [selectedFilter, setSelectedFilter] = useState<string>('all clients');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>('');
    const [showSnackBar, setShowSnackBar] = useState<boolean>(false);

    //assign counsellors to client
    const handleAssign = async (client: ClientModel) => {
        const response = await db.assignCounsellor(client);
        setConfirmClientSelection(false);
        setSelectedClient(null);
        return setMsg(response);
    };

    //fetch clients method
    const fetchClients = async () => {
        setIsLoading(true);
        const response = await db.counsellorViewClients();
        if (typeof response === 'string') {
            return setMsg(response);
        }
        const formattedClients: ClientModel[] = response.map((client) => ({
            id: String(client.id),
            name: String(client.name),
            age: Number(client.age),
            gender: String(client.gender),
            occupation: String(client.occupation),
            presenting_issue: String(client.presenting_issue),
            counsellors:
                client.counsellors === null ||
                typeof client.counsellors === 'undefined'
                    ? null
                    : {
                          name: client.counsellors[0]?.name,
                          phone_number: client.counsellors[0]?.phone_number,
                      },
        }));
        setAvailableClients(formattedClients);
        setIsLoading(false);
    };

    //useeffect method
    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (msg) {
            setShowSnackBar(true);
            fetchClients();
        }
    }, [msg]);

    return isLoading ? (
        <CircularProgress sx={{ alignSelf: 'center' }} />
    ) : (
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
                <Select
                    label="Filter"
                    sx={{ width: '70%' }}
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                >
                    <MenuItem value="all clients">all clients</MenuItem>
                    <MenuItem value="my clients">my clients</MenuItem>
                </Select>
            </Stack>
            <List>
                {availableClients.length > 0 ? (
                    (selectedFilter === 'my clients'
                        ? availableClients.filter(
                              (d) =>
                                  d.counsellors !== null &&
                                  typeof d.counsellors !== 'undefined'
                          )
                        : availableClients
                    ).map((c, index) => {
                        //log each client

                        return (
                            <Paper
                                key={index}
                                elevation={3}
                                sx={{ margin: '2%', padding: '2%' }}
                            >
                                <DisplayClients client={c} />
                                <Stack direction={'row-reverse'}>
                                    {/**buttons to modify client data  */}
                                    {c.counsellors !== null ? (
                                        <Typography>Your client</Typography>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                setSelectedClient(c);
                                                setConfirmClientSelection(true);
                                            }}
                                        >
                                            Select
                                        </Button>
                                    )}
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
                                                    onClick={() => {
                                                        if (!selectedClient)
                                                            return;

                                                        handleAssign(
                                                            selectedClient
                                                        );
                                                    }}
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
                    <Typography> No Clients Found</Typography>
                )}
            </List>
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

export default PickClient;
