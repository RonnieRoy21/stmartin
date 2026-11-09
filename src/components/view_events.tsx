import { useEffect, useState } from "react";
import Database from "../database/supabase_db";
import type { EventItem } from "../models/event_model";
import {
  Card,
  CircularProgress,
  List,
  ListItem,
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
        <Stack>
          <List sx={{ justifyContent: "center", alignContent: "center" }}>
            {events.length === 0 ? (
              <Typography>No Events Posted Yet</Typography>
            ) : (
              events.map((e, index) => {
                return (
                  <ListItem>
                    <Card
                      key={index}
                      sx={{
                        padding: "2%",
                        backgroundColor: "tan",
                        minWidth: "80%",
                      }}
                    >
                      <Stack spacing={1}>
                        <Stack direction={"row"} spacing={2}>
                          <ListItemText sx={{ fontStyle: "oblique" }}>
                            {e.name}
                          </ListItemText>
                          <ListItemText sx={{ fontStyle: "italic" }}>
                            {e.venue}
                          </ListItemText>
                          <ListItemText> {e.time}</ListItemText>
                        </Stack>
                        <Stack spacing={2}>
                          <ListItemText>Date: {e.date}</ListItemText>
                        </Stack>
                      </Stack>
                      <ListItemText> {e.description}</ListItemText>
                    </Card>
                  </ListItem>
                );
              })
            )}
          </List>
        </Stack>
      )}
    </>
  );
}

export default ViewEvents;
