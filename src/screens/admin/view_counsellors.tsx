import  { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { Counsellor } from "../../models/counsellor_model";




function ViewCounsellors(){

    const counsellors_data:Counsellor[]=[
        {
            "id":"0",
            'name':"c1",
            "email":"c1@gmail.com",
            "phone_number":"0712447933"
        },{
            "id":"1",
            "phone_number":"0766289333",
            "name":"c2",
            "email":"c2@gmail.com"
        },
        {
            "id":"2",
            "phone_number":"0738665990",
            "name":"c3",
            "email":"c3@gmail.com"
        }
    ]


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