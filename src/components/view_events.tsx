import { useEffect, useState } from "react";
import Database from "../database/supabase_db";
import type { EventItem } from "../models/event_model";
import { Card, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Stack } from "@mui/material";


function ViewEvents(){
const db=new Database()
const [isLoading,setIsLoading]=useState<boolean>(false)

const[events,setEvents]=useState<EventItem[]>([])

const fetchEvents=async ()=>{
    setIsLoading(true)
    const e=await db.getEvents()
    if(typeof e === "string"){
        setIsLoading(false)
        return window.alert(e)
    }
    setIsLoading(false)
    setEvents(e)
}

useEffect(()=>{
    fetchEvents();
},[])



    return<>{(isLoading && events.length === 0)?
    <Stack sx={{justifyContent:'center'}}>
        <CircularProgress color="secondary" aria-label="Loading Events ..." title="Loading Events ..."/>
    </Stack>
    :
    <List>
        {
            events.map((e)=>{
                return <ListItem>
                    <Card>
                        <Stack direction={'row'} spacing={'4%'}>
                            <Stack>
                                <ListItemAvatar>{e.time}</ListItemAvatar>
                                <ListItemText>{e.name}</ListItemText>
                                <ListItemText>{e.description}</ListItemText>
                            </Stack>
                            <Stack >
                                <ListItemText>{e.date}</ListItemText>
                                <ListItemText>{e.venue}</ListItemText>                            
                            </Stack>
                        </Stack>
                    </Card>
                </ListItem>
            })
        }
    </List>

    }

    </>
}

export default ViewEvents;