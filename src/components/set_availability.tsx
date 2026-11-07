
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import utc from 'dayjs/plugin/utc';
import { Button } from '@mui/material';
import Database from '../database/supabase_db';



const db=new Database()

function SetAvailability(){
    
    dayjs.extend(utc);
    const dateNow=dayjs.utc()
    const [selectedDate,setSelectedDate]=useState<Dayjs | null>(null)
    const [isSaving,setIsSaving]=useState<boolean>(false)
    

    const handleSetSchedule=async()=>{
        const user=await db.getUserId()
        if (user === null){
            window.alert("Authentication failed.Try logging in again")
            return
        }
        if(selectedDate === null || selectedDate === undefined){
            window.alert("Must select a date")
            return
        }
            setIsSaving(true)
            const time=selectedDate!.format("h:mm A")
            var day:string
            switch(selectedDate!.day()){
                case 0:
                    day="Sunday"
                    break
                case 1:
                    day="Monday"
                    break
                case 2:
                    day="Tuesday"
                    break
                case 3:
                    day="Wednesday"
                    break
                case 4:
                    day="Thursday"
                    break
                case 5:
                    day="Friday"
                    break
                case 6:
                    day="Saturday"
                    break
            }
            const response=await db.postSchedule({
               
                time:time.toString(),
                day:day,
                is_cancelled:false,
                date:selectedDate!.date(),
                month:(selectedDate!.month()+1).toString(),
                year:selectedDate!.year()

            })
            if(response === true){
                setIsSaving(false)
                return window.alert("Schedule Saved")
            }
        window.alert(response)
        setIsSaving(false)
        return
    }
    
    return <>
            <LocalizationProvider  dateAdapter={AdapterDayjs}>

            <DateTimePicker
                slotProps={{
                     mobilePaper: {
                        sx: {
                            width: "90vw",
                            maxWidth: "500px",
                            minHeight: "400px",
                            borderRadius: "16px",
                        }
                    }
                }}
                label="Select date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                
                minDate={dateNow}
            />

        </LocalizationProvider>
        <Button
        disabled={isSaving}
        onClick={()=>handleSetSchedule()}
        variant='contained'
         sx={{
            marginTop:'2%',
            backgroundColor:'beige',
            color:'blue'
        }}>Save </Button>

    </>
}

export default SetAvailability;