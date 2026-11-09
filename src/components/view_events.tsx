import { useEffect, useState } from "react";
import Database from "../database/supabase_db";
import type { EventItem } from "../models/event_model";
import {
  Card,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

function ViewEvents() {
  const db = new Database();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [events, setEvents] = useState<EventItem[]>([]);

  const fetchEvents = async () => {
    const e = await db.getEvents();
    if (typeof e === "string") {
      setIsLoading(false);
      return window.alert(e);
    }
    setIsLoading(false);
    setEvents(e);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchEvents();
  }, []);

  return (
    <>
      {isLoading && events.length === 0 ? (
        <Stack sx={{ justifyContent: "center" }}>
          <CircularProgress
            color="secondary"
            aria-label="Loading Events ..."
            title="Loading Events ..."
          />
        </Stack>
      ) : (
        <List sx={{ justifyContent: "center", alignContent: "center" }}>
          {events.length === 0 ? (
            <Typography>No Events Posted Yet</Typography>
          ) : (
            events.map((e) => {
              return (
                <ListItem>
                  <Card sx={{ padding: "1%", minWidth: "60%" }}>
                    <Stack direction={"row"} spacing={"10%"}>
                      <Stack spacing={"10%"}>
                        <ListItemText>{e.name}</ListItemText>
                        <ListItemText>{e.venue}</ListItemText>
                      </Stack>
                      <Stack spacing={"10%"}>
                        <ListItemAvatar>{e.time},</ListItemAvatar>
                        <ListItemText>{e.date}</ListItemText>
                      </Stack>
                      <ListItemText>{e.description}</ListItemText>
                    </Stack>
                  </Card>
                </ListItem>
              );
            })
          )}
        </List>
      )}
    </>
  );
}

export default ViewEvents;
