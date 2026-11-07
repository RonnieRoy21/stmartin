import  { Stack, Button } from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";



function AdminDashboard(){

    const navigate=useNavigate()
    const [activeId,setActiveId]=useState<string>("counsellorsBtn")

    const handleNavigation=(id:string,path:string)=>{
        setActiveId(id)
        navigate(path)
    }
    return <>
    <Stack direction={'row'} spacing={1}
    sx={{justifyContent:'center',paddingTop:'2%',paddingLeft:'2%',Paddingright:'2%'}}
    >
        <Button id="counsellorsBtn" variant='outlined' onClick={()=>handleNavigation("counsellorsBtn","")}
        sx={{
            backgroundColor:activeId === "counsellorsBtn" ?"orange":'whitesmoke'
        }}
            > Counsellors</Button>


        <Button id="schedulesBtn" variant='outlined'         
        sx={{
            backgroundColor:activeId === "schedulesBtn"?"orange":'whitesmoke'
        }}
        onClick={()=>handleNavigation("schedulesBtn","manage_schedules")}>Schedules</Button>


        <Button id="eventsBtn" variant='outlined' onClick={()=>handleNavigation("eventsBtn","manage_events")}
                    sx={{
            backgroundColor:activeId === "eventsBtn" ?"orange":'whitesmoke'
        }}
            >Events</Button>
    </Stack>
    <Outlet/>
    </>
}

export default AdminDashboard;