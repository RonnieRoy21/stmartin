import { ListItem, ListItemText, Stack } from '@mui/material';
import type { ClientModel } from '../models/client_model';

interface ClientProps {
    client: ClientModel;
}

function DisplayClients({ client }: ClientProps) {
    return (
        <Stack>
            <ListItem>
                <Stack sx={{ width: '100%' }}>
                    <Stack direction={'row'} spacing={'1%'}>
                        {/* name,age,occupation,gender */}
                        <ListItemText>Name:{client.name}</ListItemText>
                        <ListItemText>Age: {client.age}</ListItemText>
                    </Stack>
                    <Stack direction={'row'} spacing={'1%'}>
                        <ListItemText>Gender: {client.gender}</ListItemText>
                        <ListItemText>
                            Occupation: {client.occupation}
                        </ListItemText>
                    </Stack>
                    <Stack direction={'row'}>
                        {/** presenting issue */}
                        <ListItemText>
                            Issue: {client.presenting_issue}
                        </ListItemText>
                    </Stack>
                </Stack>
            </ListItem>
        </Stack>
    );
}

export default DisplayClients;
