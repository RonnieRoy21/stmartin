import { Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import Database from "../database/supabase_db";
import axios from 'axios'



function AdminLogin(){

    const navigate=useNavigate()
    const adminUrl="http://localhost:8000";
    const [adminEmail,setAdminEmail]=useState<string>("");
    const [adminPassword,setAdminPassword]=useState<string>("");
    const [adminTotp,setAdminTotp]=useState<string>("");
    const [otpFieldEnabled,setOtpFieldEnabled]=useState<boolean>(false);
    const [attemptingLogin,setAttemptingLogin]=useState<boolean>(false);



    const handleAdminLogin=async()=>{
        if (adminEmail.trim().length === 0 ){
            return window.alert("Email is required")
            
        }
        if (adminPassword.trim().length === 0 ){
           return window.alert("Password is required")
            
        }

        const db=new Database()
        
        const token=await db.adminSignIn(adminEmail,adminPassword)
        
        
        if (token !== undefined && token !== null){
            setAttemptingLogin(true)
            try{

                const response= await axios.get(`${adminUrl}/admin/verification`,{
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                }
            })
            if (response.status === 200){
                setAttemptingLogin(false)
                setOtpFieldEnabled(true)
                return window.alert(response.data['message'])
            }
            return window.alert(response.statusText.split(":")[1])
            }catch(err){
                setAttemptingLogin(false)
                return window.alert(String(err).split(":")[1])
            }
            

               
    }
    setAttemptingLogin(false)
}

    const handleVerification=async (code:string)=>{

        const response=await axios.post(`${adminUrl}/admin/verify-code/${code}`,{},{
            headers:{
                "Content-Type":"application/json",
            }
        })
        if (response.status === 200){
            const isVerified:boolean=response.data['verified']
            if (isVerified){
                window.alert("Verified")
                navigate("dashboard")
                return
            }else{
           return window.alert("Invalid or expired code.")
           
        }}
        return window.alert(response.statusText)
    }


    return <>
    <Stack spacing={3} sx={{paddingLeft:'10%',paddingRight:'10%',paddingTop:'5%'}}>
        <Typography sx={{color:'blue',fontStyle:'oblique'}}>Use your admin credentials to proceed</Typography>
        <TextField required value={adminEmail} type="email"
        onChange={(v)=>setAdminEmail(v.target.value)}
        label="Admin Email"

        />
        <TextField required value={adminPassword} type="password"
        onChange={(v)=>setAdminPassword(v.target.value)}
        label="Admin Password"
        />

        <Typography variant="subtitle2" sx={{fontSize:'70%'}}>Login with email and password to receive verfication code</Typography>

        <TextField required disabled={!otpFieldEnabled} 
        value={adminTotp} type='number'
        sx={{
            backgroundColor:otpFieldEnabled?'orange':null
        }}
        onChange={(v)=>setAdminTotp(v.target.value)}
        label="Enter Verification Code"
        />

        <Stack spacing={'5%'} direction ={'row'} sx={{marginTop:'2%',}}>
            {attemptingLogin? 
            <CircularProgress color='secondary' aria-label="Signing In" />
            :
            <Button disabled={otpFieldEnabled} 
            onClick={()=>handleAdminLogin()}
            >Login</Button>}


            <Button variant="contained" disabled={!otpFieldEnabled} onClick={()=>handleVerification(adminTotp.toString())}>Verify Code</Button>
            <Button
            onClick={()=>navigate("/")}
            >Back</Button>
        </Stack>
    </Stack>
    </>
    }

export default AdminLogin;