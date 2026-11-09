import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import ViewEvents from "../../components/view_events";
import { useState } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import axios from "axios";
import type { EventItem } from "../../models/event_model";
import Database from "../../database/supabase_db";

function ManageEvents() {
  const adminUrl = import.meta.env.VITE_ADMIN_URL;

  dayjs.extend(utc);
  const dateNow = dayjs.utc();
  //   const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [eventTime, setEventTime] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");
  const [eventVenue, setEventVenue] = useState<string>("");

  const validateInput = () => {
    if (selectedDate === null) {
      return "Select a date and time";
    }
    if (eventName.trim().length === 0) {
      return "Give the event a name";
    }
    if (eventVenue.trim().length === 0) {
      return "Venue not set";
    }
    return true;
  };

  const uploadEvent = async () => {
    const db = new Database();
    //set the date and time values
    setEventTime(dayjs(selectedDate).format("h:mm:A"));
    setEventDate(dayjs(selectedDate).format("DD/MM/YYYY"));

    const res = validateInput();
    if (res !== true) {
      return window.alert(res);
    }

    //save the event post to db using admin endpoint
    const e: EventItem = {
      date: eventDate,
      description: eventDescription,
      name: eventName,
      time: eventTime,
      venue: eventVenue,
    };
    const token = await db.getToken();
    if (typeof token === "boolean") {
      return window.alert("Session may be expired, try to login again.");
    }
    const response = await axios.post(`${adminUrl}/events/publish`, e, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setIsDialogOpen(false);
      return window.alert(response.data["message"]);
    }
    setIsDialogOpen(false);
    return window.alert(response.statusText);
  };

  return (
    <>
      <Stack spacing={"1%"} sx={{ padding: "1%" }}>
        <ViewEvents />
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          sx={{ alignSelf: "start", alignContent: "space-evenly" }}
        >
          <DialogTitle>Add Event</DialogTitle>
          <DialogContent sx={{ alignContent: "space-around" }}>
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  slotProps={{
                    mobilePaper: {
                      sx: {
                        width: "90vw",
                        maxWidth: "500px",
                        minHeight: "400px",
                        borderRadius: "16px",
                      },
                    },
                  }}
                  label="Select date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  minDate={dateNow}
                />
              </LocalizationProvider>
            </>
            <TextField
              required
              type="text"
              label="Name of the event"
              onChange={(e) => {
                setEventName(e.target.value);
              }}
            />
            <TextField
              required
              type="text"
              label="Venue for the event"
              onChange={(e) => setEventVenue(e.target.value)}
            />
            <TextField
              type="text"
              label="Description (Optional)"
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => uploadEvent()}>Save</Button>
          </DialogActions>
        </Dialog>

        <Button
          variant="contained"
          sx={{ maxWidth: "50%", alignSelf: "center" }}
          onClick={() => setIsDialogOpen(true)}
        >
          Add Event
        </Button>
      </Stack>
    </>
  );
}

export default ManageEvents;
