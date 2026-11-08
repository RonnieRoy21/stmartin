import  { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { Counsellor } from "../../models/counsellor_model";
import { useEffect ,useState} from "react";
import Database from "../../database/supabase_db";




function ViewCounsellors(){


    const db=new Database()
    const [counsellors_data,setCounsellorsData]=useState<Counsellor[]>([])

    useEffect(()=>{
        //fetch counsellors
        const getCounsellors=async()=>{
            const res=await db.fetchAllCounsellors()
            if (typeof res === "string"){
                return window.alert(res)
            }
            setCounsellorsData(res)
        }
        getCounsellors();
    },[])


    return <>
    <Stack>
        <Typography>Registered Counsellors</Typography>
<TableContainer sx={{padding:'1%'}}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>EMAIL</TableCell>
                    <TableCell>NAME</TableCell>
                    <TableCell>PHONE NUMBER</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {counsellors_data.map((d,index)=>{
                    return <>
                    <TableRow key={index.toString()}>
                        <TableCell>{d.email}</TableCell>
                        <TableCell>{d.name}</TableCell>
                        <TableCell>{d.phone_number}</TableCell>                
                    </TableRow>
                    </>
                })}
            </TableBody>
        </Table>
    </TableContainer>
    </Stack>
    </>
}

export default ViewCounsellors;


