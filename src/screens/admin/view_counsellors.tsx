import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Counsellor } from "../../models/counsellor_model";
import { useEffect, useState } from "react";
import Database from "../../database/supabase_db";
import axios from "axios";

function ViewCounsellors() {
  const db = new Database();
  const adminUrl = import.meta.env.VITE_ADMIN_URL;
  const [counsellors_data, setCounsellorsData] = useState<Counsellor[]>([]);

  useEffect(() => {
    //fetch counsellors
    const getCounsellors = async () => {
      const token = await db.getToken();
      if (typeof token === "boolean") {
        return window.alert("Session is expired,try to login again");
      }
      const res = await axios.get(`${adminUrl}/admin/counsellors/profiles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status !== 200) {
        return window.alert(res.statusText);
      }
      console.log(res.data);

      setCounsellorsData(res.data);
    };
    getCounsellors();
  }, []);

  return (
    <>
      <Stack>
        <Typography>Registered Counsellors</Typography>
        <TableContainer sx={{ padding: "1%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>EMAIL</TableCell>
                <TableCell>NAME</TableCell>
                <TableCell>PHONE NUMBER</TableCell>
                <TableCell>REGISTERED AS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {counsellors_data.map((d, index) => {
                return (
                  <>
                    <TableRow key={index.toString()}>
                      <TableCell>{d.email}</TableCell>
                      <TableCell>{d.name}</TableCell>
                      <TableCell>{d.phone_number}</TableCell>
                      <TableCell>{d.role}</TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}

export default ViewCounsellors;
