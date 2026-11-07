import {  Card, CardContent, Stack, Typography } from "@mui/material";
import SetAvailability from "../../components/set_availability";
import CreateCard from "../../components/card_layout";
import { useNavigate } from "react-router";




interface cardItem{
    title:string,
    content:string,
    id:string,
    actionTitle:string | null
}


function HomePage(){

    const navigate=useNavigate()
    const cards:Array<cardItem>=[
        {
            id:"schedules",
            title:"View My Schedules",
            content:"your views in one place", 
            actionTitle:"View All"
        },
        {
            id:"events",
            title:"Events",
            content:"Have a look at upcoming events.",
            actionTitle:"Have a Look"
             
        },
        {
            id:"profile",
            title:"My Profile",
            content:"Manage your personal info", 
            actionTitle:"Manage"
        }
    ]
    

    return <>
    <Stack spacing={2}>
         <Typography variant='subtitle2' sx={{
            marginBottom:'1%'
         }}>
                Everything you need,it's right here
         </Typography>
         <Stack  spacing={1} sx={{
            padding:'8%'
         }}>
            <Card sx={{backgroundColor:'tan'}} key={'cardAvailability'}>
                <CardContent sx={{color:'brown',fontStyle:'oblique'}}>When are you Available?</CardContent>
                <CardContent>{<SetAvailability/>}</CardContent>

            </Card>
            <Stack spacing={2}>
                {cards.map((card,index)=>{
                    return <>
                     <CreateCard
                    key={index.toString()}
                    id={card.id}
                    header={card.title}
                    content={card.content}
                    actionTitle={card.actionTitle}
                    actions={()=>navigate(card.id)}/>
                    </>
                })}
            </Stack>
         </Stack>
    </Stack>
   
    </>
}

export default HomePage;