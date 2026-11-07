import {List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Database from "../../database/supabase_db";
import type { CounsellorSchedule } from "../../models/counsellor_model";



function ManageSchedules(){

    const db= new Database()
    const [schedules,setSchedules]=useState<CounsellorSchedule[] >([])

    useEffect(()=>{
        const fetchSchedules=async()=>{
            const result=await db.adminGetAllSchedules() 
            if (typeof result === "string"){
                return window.alert(result)
            }
            if(result !== undefined && result?.length > 0){
                 setSchedules(result) 
            }
          
        }
        fetchSchedules();
    },[])
    return <>
    <Stack>
        <Typography>Manage Schedules</Typography>
        { schedules !== null && schedules.length > 0 ?
        <List>
            {
                schedules.map((s:CounsellorSchedule,index)=>{
                    console.log("One log is "+s.day);
                    console.log("One log is "+s.month);
                    console.log("One log is "+s.year);
                    console.log("One log is "+s.date);
                    console.log("One log is "+s.time);
                    console.log("Counsellors is "+s.counsellors[0]);
                    
                    return <>
                    <ListItem key={index}>
                        <Stack direction={'row'} spacing={1}>
                            <Stack spacing={2}> 
                            <ListItemText>{s.counsellors[0].id}</ListItemText>
                            <ListItemText>{s.month},{s.year}</ListItemText>
                        </Stack>
                        <Stack spacing={2}>
                            <ListItemText>{s.day}</ListItemText>
                            <ListItemText>{s.time}</ListItemText>
                        </Stack>
                        </Stack>
                        <ListItemText></ListItemText>
                    </ListItem>
                    </>
                })
            }
        </List>:<Typography>Counsellors haven't set their availability dates</Typography>}

    </Stack>
    </>
}

export default ManageSchedules;