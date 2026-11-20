import { List, ListItem, ListItemText, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import type { ClientModel } from '../models/client_model';
import axios from 'axios';
import Database from '../database/supabase_db';

function DisplayClients() {
    const db = new Database();
    const adminUrl = import.meta.env.VITE_ADMIN_URL;
    const [uploadedClients, setUploadedClients] = useState<ClientModel[]>([]);

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

    useEffect(() => {
        fetchClients();
    }, []);

    console.log('client data: ' + uploadedClients.length);

    return (
        <Stack>
            <List>
                {uploadedClients.map((c) => {
                    return (
                        <Paper elevation={3} sx={{ marginBottom: '2%' }}>
                            <ListItem>
                                <Stack sx={{ width: '100%' }}>
                                    <Stack direction={'row'} spacing={'1%'}>
                                        {/* name,age,occupation,gender */}
                                        <ListItemText>
                                            Name:{c.name}
                                        </ListItemText>
                                        <ListItemText>
                                            Age: {c.age}
                                        </ListItemText>
                                    </Stack>
                                    <Stack direction={'row'} spacing={'1%'}>
                                        <ListItemText>
                                            Gender: {c.gender}
                                        </ListItemText>
                                        <ListItemText>
                                            Occupation: {c.occupation}
                                        </ListItemText>
                                    </Stack>
                                    <Stack direction={'row'}>
                                        {/** presenting issue */}
                                        <ListItemText>
                                            Issue: {c.presenting_issue}
                                        </ListItemText>
                                    </Stack>
                                    <Stack direction={'row'}>
                                        {/**counsellor name and number if present */}
                                        {c.counsellors ? (
                                            <>
                                                <ListItemText>
                                                    Assigned To:{' '}
                                                    {c.counsellors?.name},
                                                    {'0' +
                                                        c.counsellors
                                                            .phone_number}
                                                </ListItemText>
                                            </>
                                        ) : (
                                            <ListItem>
                                                Not assigned a counsellor yet
                                            </ListItem>
                                        )}
                                    </Stack>
                                    <Stack direction={'row'}>
                                        {/**buttons to modify client data  */}
                                    </Stack>
                                </Stack>
                            </ListItem>
                        </Paper>
                    );
                })}
            </List>
        </Stack>
    );
}

export default DisplayClients;
