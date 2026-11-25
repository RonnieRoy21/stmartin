import {
    CircularProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import type { Counsellor } from '../../models/counsellor_model';
import { useEffect, useState } from 'react';
import Database from '../../database/supabase_db';
import axios from 'axios';
import ShowSnackBar from '../../components/snackbar';

function ViewCounsellors() {
    const db = new Database();
    const adminUrl = import.meta.env.VITE_ADMIN_URL;
    const [counsellors_data, setCounsellorsData] = useState<Counsellor[]>([]);
    const [isLoadingCounsellors, setIsLoadingcounsellors] =
        useState<boolean>(false);

    const [msg, setMsg] = useState<string>('');
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    useEffect(() => {
        //fetch counsellors
        const getCounsellors = async () => {
            setIsLoadingcounsellors(true);
            const token = await db.getToken();
            if (typeof token === 'boolean') {
                return setMsg('Session is expired,try to login again');
            }
            const res = await axios.get(`${adminUrl}/counsellors/profiles`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.status !== 200) {
                return setMsg(res.statusText);
            }
            setIsLoadingcounsellors(false);
            setCounsellorsData(res.data);
        };
        getCounsellors();
    }, []);

    useEffect(() => {
        if (msg) {
            setShowSnackbar(true);
        }
    }, [msg]);

    return (
        <>
            {isLoadingCounsellors ? (
                <CircularProgress sx={{ alignSelf: 'center' }} />
            ) : (
                <Stack>
                    <Typography>Registered Counsellors</Typography>
                    <TableContainer sx={{ padding: '1%', marginBottom: '10%' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>NO.</TableCell>
                                    <TableCell>NAME</TableCell>
                                    <TableCell>EMAIL</TableCell>
                                    <TableCell>PHONE NUMBER</TableCell>
                                    <TableCell>REGISTERED AS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {counsellors_data.map((d, index) => {
                                    return (
                                        <>
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>{d.name}</TableCell>
                                                <TableCell>{d.email}</TableCell>
                                                <TableCell>
                                                    {'0' + d.phone_number}
                                                </TableCell>
                                                <TableCell>{d.role}</TableCell>
                                            </TableRow>
                                        </>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            )}
            <ShowSnackBar
                open={showSnackbar}
                message={msg}
                close={() => {
                    setShowSnackbar(false);
                    setMsg('');
                }}
            />
        </>
    );
}

export default ViewCounsellors;
