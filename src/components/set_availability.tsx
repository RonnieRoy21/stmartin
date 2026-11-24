import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import utc from 'dayjs/plugin/utc';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    Typography,
} from '@mui/material';
import Database from '../database/supabase_db';
import type { ScheduleItem } from '../models/schedule_item';
import { Cancel } from '@mui/icons-material';

const db = new Database();

function SetAvailability() {
    dayjs.extend(utc);
    const dateNow = dayjs.utc();
    const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
    const [currentDate, setCurrentDate] = useState<Dayjs | null>(null);
    const [openDatesDialog, setOpenDatesDialog] = useState<boolean>(false);
    const [finalSchedules, setFinalSchedules] = useState<ScheduleItem[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(false);

    const handleSetSchedules = async () => {
        const user = await db.getUserId();
        if (user === null) {
            window.alert('Authentication failed.Try logging in again');
            return;
        }
        if (selectedDates === null || selectedDates === undefined) {
            window.alert('Must select a date');
            return;
        }
        setIsSaving(true);

        const response = await db.postSchedule(finalSchedules);
        if (response === true) {
            setIsSaving(false);
            setSaved(true);
            return window.alert('Schedule(s) Saved');
        }
        window.alert(response);

        setIsSaving(false);
        return;
    };

    const handleFormatSchedules = () => {
        const schedules: ScheduleItem[] = selectedDates.map((d) => {
            const time = d!.format('h:mm A');
            var day: string;
            switch (d!.day()) {
                case 0:
                    day = 'Sunday';
                    break;
                case 1:
                    day = 'Monday';
                    break;
                case 2:
                    day = 'Tuesday';
                    break;
                case 3:
                    day = 'Wednesday';
                    break;
                case 4:
                    day = 'Thursday';
                    break;
                case 5:
                    day = 'Friday';
                    break;
                case 6:
                    day = 'Saturday';
                    break;
            }

            return {
                time: time.toString(),
                day: day,
                is_cancelled: false,
                date: d!.date(),
                month: (d!.month() + 1).toString(),
                year: d!.year(),
            };
        });
        setOpenDatesDialog(true); //display on the dialog box
        setFinalSchedules(schedules); //set the final schedules
    };
    const handleRemoveDate = (pos: number) => {
        setFinalSchedules((finalSchedules) =>
            finalSchedules.filter((_, index) => index != pos)
        );
    };

    useEffect(() => {
        if (saved) {
            console.log('resetting dates...');
            setSelectedDates([]); //clear prev list of dates
            setFinalSchedules([]);
            setCurrentDate(null);
            setSaved(false);
            console.log('dates reset.');
        }
    }, [saved]);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    slotProps={{
                        actionBar: {
                            actions: ['cancel', 'accept'],
                        },
                        mobilePaper: {
                            sx: {
                                width: '90vw',
                                maxWidth: '500px',
                                minHeight: '400px',
                                borderRadius: '16px',
                            },
                        },
                    }}
                    label="Select date(s)"
                    onAccept={(newValue, context) => {
                        if (!newValue || !newValue.isValid()) return;

                        if (context.validationError !== null) return;

                        setSelectedDates((prev) => {
                            const exists = prev.some((date) =>
                                date.isSame(newValue, 'minute')
                            );

                            if (exists) return prev;

                            return [...prev, newValue];
                        });
                    }}
                    value={currentDate}
                    onChange={(newValue) => {
                        if (!newValue) return;

                        setCurrentDate(newValue);
                    }}
                    minDate={dateNow}
                />
            </LocalizationProvider>

            <Typography variant="subtitle2">
                Select one or more dates then save
            </Typography>
            <Button
                disabled={isSaving}
                onClick={() => {
                    handleFormatSchedules();
                }}
                variant="contained"
                sx={{
                    marginTop: '2%',
                    backgroundColor: 'beige',
                    color: 'blue',
                }}
            >
                Save{' '}
            </Button>

            <Dialog
                open={openDatesDialog && finalSchedules.length > 0}
                onClose={() => setOpenDatesDialog(false)}
            >
                <DialogTitle>Confirm dates </DialogTitle>
                <DialogContent>
                    <List>
                        {finalSchedules.map((s, index) => {
                            return (
                                <ListItem key={index}>
                                    <Typography>
                                        {s.day},{s.date}/{s.month}/{s.year},
                                        {s.time}
                                    </Typography>
                                    <IconButton
                                        onClick={() => {
                                            handleRemoveDate(index);
                                        }}
                                    >
                                        <Cancel />
                                    </IconButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={isSaving}
                        variant="contained"
                        onClick={() => handleSetSchedules()}
                        sx={{ alignSelf: 'center' }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default SetAvailability;
