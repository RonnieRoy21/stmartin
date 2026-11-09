import {
  Card,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Database from "../../database/supabase_db";
import axios from "axios";
import type { SetSchedules } from "../../models/schedule_item";

function ManageSchedules() {
  const db = new Database();
  const adminUrl = import.meta.env.VITE_ADMIN_URL;
  const [schedules, setSchedules] = useState<SetSchedules[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      const token = await db.getToken();
      if (typeof token === "boolean") {
        return window.alert("Session may be expired, try to login again.");
      }
      setIsLoading(true);
      const result = await axios.get(`${adminUrl}/counsellors/schedules`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (result.status !== 200) {
        return window.alert(result.statusText);
      }
      setIsLoading(false);
      setSchedules(result.data);
    };
    fetchSchedules();
  }, []);

  return (
    <>
      <Stack>
        <Typography>All Counsellors' Schedules</Typography>
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
          <List>
            {schedules.map((s: SetSchedules, index) => {
              return (
                <>
                  <ListItem>
                    <Card key={index} sx={{ padding: "2%" }}>
                      <Stack spacing={1}>
                        <Stack direction={"row"} spacing={2}>
                          <ListItemText>
                            Name: {s.counsellors.name}
                          </ListItemText>
                          <ListItemText>
                            {s.day},Date {s.date}
                          </ListItemText>
                          <ListItemText>Time: {s.time}</ListItemText>
                        </Stack>
                        <Stack spacing={2}>
                          <ListItemText>
                            Month/Year :{s.month},{s.year}
                          </ListItemText>
                        </Stack>
                      </Stack>
                      <ListItemText></ListItemText>
                    </Card>
                  </ListItem>
                </>
              );
            })}
          </List>
        )}
      </Stack>
    </>
  );
}

export default ManageSchedules;
