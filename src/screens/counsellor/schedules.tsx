import {
  Button,
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
} from "@mui/material";
import Database from "../../database/supabase_db";
import { useEffect, useState } from "react";
import { type StoredScheduleItem } from "../../models/schedule_item";

const db = new Database();

function SchedulesPage() {
  const [cancelReason, setCancelReason] = useState<string>("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [mySchedules, setMySchedules] = useState<Array<StoredScheduleItem>>([]);
  const [cancelledSchedules, setCancelledSchedules] = useState<Array<number>>(
    [],
  );
  const [viewActive, setViewActive] = useState<boolean>(true);
  const handleCancel = async (id: number, reason: string) => {
    try {
      const response = await db.cancelSchedule(id, reason);
      if (response === true) {
        setCancelledSchedules((prev) => [...prev, prev.push(id)]);
        return window.alert("Schedule cancelled");
      }
      return window.alert(response);
    } catch (err) {
      return window.alert("An Error Occured.");
    }
  };

  useEffect(() => {
    const getSchedules = async () => {
      const result = await db.getSchedules();
      if (typeof result === "string") {
        return window.alert(result);
      }
      setMySchedules(result);
    };
    getSchedules();
  }, [cancelledSchedules]);

  return (
    <>
      <p>All your upcoming schedules in one place</p>
      <Stack direction={"row"} spacing={2} sx={{ justifyContent: "center" }}>
        <Button
          onClick={() => setViewActive(true)}
          variant="contained"
          sx={{ backgroundColor: "orange", color: "black" }}
        >
          Active
        </Button>
        <Button
          onClick={() => setViewActive(false)}
          variant="contained"
          sx={{ backgroundColor: "gray", clor: "orange" }}
        >
          Cancelled
        </Button>
      </Stack>
      <List>
        {mySchedules
          .filter((s) => s.is_cancelled === !viewActive)
          .map((s, index) => {
            return (
              <>
                <ListItem
                  sx={{
                    backgroundColor: "beige",
                    color: "black",
                    marginBottom: "1%",
                  }}
                  key={index.toString()}
                >
                  <ListItemAvatar sx={{ padding: "2%" }}>
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
                        <>
                          <Typography>Reason: {s.cancel_reason}</Typography>
                        </>
                      ) : null}
                    </ListItemText>
                  </Stack>
                  {s.is_cancelled ? null : (
                    <Button
                      disabled={cancelledSchedules.some((n) => n === s.id)}
                      sx={{
                        backgroundColor: "orange",
                        color: "black",
                        marginLeft: "30%",
                        borderRadius: "10%",
                      }}
                      onClick={() => {
                        setCancelDialogOpen(true);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </ListItem>
                <>
                  <Dialog
                    open={cancelDialogOpen}
                    onClose={() => setCancelDialogOpen(false)}
                    sx={{ alignContent: "space-evenly" }}
                  >
                    <DialogTitle>Provide a reason</DialogTitle>
                    <DialogContent>
                      <TextField
                        multiline={true}
                        id="reasonController"
                        label="Why cancel?"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Stack direction={"row"}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (cancelReason.trim().length === 0) {
                              return window.alert("Reason can't be empty");
                            }
                            handleCancel(s.id, cancelReason);
                          }}
                        >
                          Cancel Schedule
                        </Button>
                        <Button onClick={() => setCancelDialogOpen(false)}>
                          Exit
                        </Button>
                      </Stack>
                    </DialogActions>
                  </Dialog>
                </>
              </>
            );
          })}
      </List>
    </>
  );
}

export default SchedulesPage;
