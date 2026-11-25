import {
    Card,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Database from '../../database/supabase_db';
import axios from 'axios';
import type { SetSchedules } from '../../models/schedule_item';
import SearchIcon from '@mui/icons-material/Search';
import ShowSnackBar from '../../components/snackbar';

function ManageSchedules() {
    const db = new Database();
    const adminUrl = import.meta.env.VITE_ADMIN_URL;
    const [schedules, setSchedules] = useState<SetSchedules[]>([]);
    const [schedulesByName, setSchedulesByName] = useState<SetSchedules[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<boolean>(true);
    const [msg, setMsg] = useState<string>('');
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    useEffect(() => {
        const fetchSchedules = async () => {
            const token = await db.getToken();
            if (typeof token === 'boolean') {
                return setMsg('Session may be expired, try to login again.');
            }
            setIsLoading(true);
            const result = await axios.get(
                `${adminUrl}/counsellors/schedules`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (result.status !== 200) {
                return setMsg(result.statusText);
            }
            setIsLoading(false);
            setSchedules(result.data);
        };
        fetchSchedules();
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim().length > 0) {
            setSchedulesByName(
                schedules.filter((s) =>
                    s.counsellors.name
                        .toLowerCase()
                        .includes(searchTerm.trim().toLowerCase())
                )
            );
        } else {
            setSchedulesByName(schedules);
        }
    };

    useEffect(() => {
        if (msg) {
            setShowSnackbar(true);
        }
    }, [msg]);

    return (
        <>
            <Stack sx={{ alignContent: 'center', justifyContent: 'center' }}>
                <Typography>All Counsellors' Schedules</Typography>
                <Stack
                    direction={'row'}
                    sx={{
                        justifyContent: 'space-around',
                        marginBottom: '10%',
                    }}
                >
                    <TextField
                        value={searchTerm}
                        label="Search by counsellor name"
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <IconButton onClick={() => handleSearch()}>
                                        <SearchIcon />
                                    </IconButton>
                                ),
                            },
                        }}
                    />
                    <Select
                        value={activeFilter ? 'active' : 'cancelled'}
                        onChange={(e) =>
                            e.target.value === 'active'
                                ? setActiveFilter(true)
                                : setActiveFilter(false)
                        }
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                </Stack>
                {isLoading && (schedules === null || schedules.length < 0) ? (
                    <>
                        <CircularProgress
                            color="secondary"
                            aria-label="Loading schedules ..."
                            title="Loading schedules ..."
                        />
                        <Typography>Loading ...</Typography>
                    </>
                ) : (
                    <List
                        sx={{
                            alignContent: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {(searchTerm.trim().length === 0
                            ? schedules
                            : schedulesByName
                        )
                            .filter((s) => !s.is_cancelled === activeFilter)
                            .map((s: SetSchedules, index) => {
                                return (
                                    <ListItem key={index}>
                                        <Card
                                            key={index}
                                            sx={{
                                                padding: '2%',
                                                backgroundColor: s.is_cancelled
                                                    ? 'tomato'
                                                    : 'whitesmoke',
                                            }}
                                        >
                                            <Stack spacing={1}>
                                                <Stack
                                                    direction={'row'}
                                                    spacing={2}
                                                >
                                                    <ListItemText>
                                                        Name:{' '}
                                                        {s.counsellors.name}
                                                    </ListItemText>
                                                    <ListItemText>
                                                        {s.day},Date {s.date}
                                                    </ListItemText>
                                                    <ListItemText>
                                                        Time: {s.time}
                                                    </ListItemText>
                                                </Stack>
                                                <Stack spacing={2}>
                                                    <ListItemText>
                                                        Month/Year :{s.month},
                                                        {s.year}
                                                    </ListItemText>
                                                </Stack>
                                            </Stack>
                                            {s.is_cancelled && (
                                                <ListItemText>
                                                    Reason : {s.cancel_reason}
                                                </ListItemText>
                                            )}
                                        </Card>
                                    </ListItem>
                                );
                            })}
                    </List>
                )}
            </Stack>
            <ShowSnackBar
                open={showSnackbar}
                message={msg}
                close={() => {
                    setShowSnackbar(false);
                    setMsg('');
                }}
            />
        </>
    );
}

export default ManageSchedules;
