import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import Database from '../../database/supabase_db';
import { useEffect, useState } from 'react';
import { type StoredScheduleItem } from '../../models/schedule_item';
import ShowSnackBar from '../../components/snackbar';

const db = new Database();

function SchedulesPage() {
    const [cancelReason, setCancelReason] = useState<string>('');
    const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
    const [activeButton, setActiveButton] = useState<string>('active');
    const [mySchedules, setMySchedules] = useState<Array<StoredScheduleItem>>(
        []
    );
    const [cancelledSchedules, setCancelledSchedules] = useState<Array<number>>(
        []
    );
    const [viewActive, setViewActive] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCancelling, setISCancelling] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>('');
    const [showSnackbar, setShowsnackbar] = useState<boolean>(false);

    const handleCancel = async (id: number, reason: string) => {
        try {
            setISCancelling(true);
            const response = await db.cancelSchedule(id, reason);
            setISCancelling(false);
            if (typeof response === 'boolean') {
                setCancelledSchedules((prev) => [...prev, prev.push(id)]);
                return setMsg('Schedule cancelled');
            }
            return setMsg(response);
        } catch (err) {
            return setMsg('An Error Occured.');
        }
    };

    useEffect(() => {
        const getSchedules = async () => {
            setIsLoading(true);
            const result = await db.getSchedules();
            if (typeof result === 'string') {
                return setMsg(result);
            }
            setIsLoading(false);
            setMySchedules(result);
        };
        getSchedules();
    }, [cancelledSchedules]);

    useEffect(() => {
        if (msg) {
            setShowsnackbar(true);
        }
    }, [msg]);

    return (
        <>
            <p>All your upcoming schedules in one place</p>
            <Stack
                direction={'row'}
                spacing={2}
                sx={{ justifyContent: 'center' }}
            >
                <Button
                    id="active"
                    onClick={() => {
                        setActiveButton('active');
                        setViewActive(true);
                    }}
                    variant="contained"
                    sx={{
                        backgroundColor:
                            activeButton === 'active' ? 'orange' : 'gray',
                        color: 'black',
                    }}
                >
                    Active
                </Button>
                <Button
                    id="cancelled"
                    onClick={() => {
                        setActiveButton('cancelled');
                        setViewActive(false);
                    }}
                    variant="contained"
                    sx={{
                        backgroundColor:
                            activeButton === 'cancelled' ? 'orange' : 'gray',
                    }}
                >
                    Cancelled
                </Button>
            </Stack>
            <List>
                {isLoading ? (
                    <CircularProgress sx={{ alignSelf: 'center' }} />
                ) : (
                    <Stack sx={{ marginBottom: '10%' }}>
                        {mySchedules
                            .filter((s) => s.is_cancelled === !viewActive)
                            .map((s, index) => {
                                return (
                                    <Stack key={index}>
                                        <ListItem
                                            sx={{
                                                backgroundColor: 'beige',
                                                color: 'black',
                                                marginBottom: '2%',
                                            }}
                                        >
                                            <ListItemAvatar
                                                sx={{ padding: '2%' }}
                                            >
                                                {s.time}
                                            </ListItemAvatar>
                                            <Stack>
                                                <ListItemText>
                                                    On {s.day}, Date: {s.date}
                                                </ListItemText>
                                                <ListItemText>
                                                    {s.month}, {s.year}
                                                </ListItemText>
                                                <ListItemText>
                                                    {s.is_cancelled ? (
                                                        <Typography>
                                                            Reason:{' '}
                                                            {s.cancel_reason}
                                                        </Typography>
                                                    ) : null}
                                                </ListItemText>
                                            </Stack>
                                            {s.is_cancelled ? null : isCancelling ? (
                                                <CircularProgress />
                                            ) : (
                                                <Button
                                                    disabled={cancelledSchedules.some(
                                                        (n) => n === s.id
                                                    )}
                                                    sx={{
                                                        backgroundColor:
                                                            'orange',
                                                        color: 'black',
                                                        marginLeft: 'auto',
                                                        alignSelf: 'end',
                                                        borderRadius: '10%',
                                                    }}
                                                    onClick={() => {
                                                        setCancelDialogOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </ListItem>

                                        <Dialog
                                            open={cancelDialogOpen}
                                            onClose={() =>
                                                setCancelDialogOpen(false)
                                            }
                                            sx={{
                                                alignContent: 'space-evenly',
                                            }}
                                        >
                                            <DialogTitle>
                                                Provide a reason
                                            </DialogTitle>
                                            <DialogContent>
                                                <TextField
                                                    multiline={true}
                                                    id="reasonController"
                                                    label="Why cancel?"
                                                    value={cancelReason}
                                                    onChange={(e) =>
                                                        setCancelReason(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Stack direction={'row'}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => {
                                                            if (
                                                                cancelReason.trim()
                                                                    .length ===
                                                                0
                                                            ) {
                                                                return window.alert(
                                                                    "Reason can't be empty"
                                                                );
                                                            }
                                                            handleCancel(
                                                                s.id,
                                                                cancelReason
                                                            );
                                                        }}
                                                    >
                                                        Cancel Schedule
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            setCancelDialogOpen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        Exit
                                                    </Button>
                                                </Stack>
                                            </DialogActions>
                                        </Dialog>
                                    </Stack>
                                );
                            })}
                    </Stack>
                )}
            </List>

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

export default SchedulesPage;
