import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import Database from '../../database/supabase_db';
import ShowSnackBar from '../../components/snackbar';

function AdminDashboard() {
    const db = new Database();
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState<string>('');
    const [msg, setMsg] = useState<string>('');
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    const handleNavigation = (id: string, path: string) => {
        setActiveId(id);
        navigate(path);
    };

    const handleLogout = async () => {
        const res = await db.logoutUser();
        if (typeof res === 'boolean') {
            //logout success
            navigate('/');

            return;
        }
        setMsg('Sign out FAILED');
    };

    useEffect(() => {
        setShowSnackbar(true);
    }, [msg]);

    return (
        <>
            <Outlet />
            <BottomNavigation
                showLabels
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    justifyContent: 'space-evenly',
                    backgroundColor: 'bisque',
                }}
            >
                <BottomNavigationAction
                    id="counsellorsBtn"
                    label="Counsellors"
                    sx={{
                        color: 'white',
                        backgroundColor:
                            activeId === 'counsellorsBtn' ? 'orange' : 'gray',
                    }}
                    onClick={() => handleNavigation('counsellorsBtn', '')}
                />
                <BottomNavigationAction
                    id="schedulesBtn"
                    label="Schedules"
                    onClick={() =>
                        handleNavigation('schedulesBtn', 'manage_schedules')
                    }
                    sx={{
                        color: 'white',
                        backgroundColor:
                            activeId === 'schedulesBtn' ? 'orange' : 'gray',
                    }}
                />
                <BottomNavigationAction
                    id="eventsBtn"
                    label="Events"
                    onClick={() =>
                        handleNavigation('eventsBtn', 'manage_events')
                    }
                    sx={{
                        color: 'white',
                        backgroundColor:
                            activeId === 'eventsBtn' ? 'orange' : 'gray',
                    }}
                />
                <BottomNavigationAction
                    id="clientsBtn"
                    label="Clients"
                    onClick={() =>
                        handleNavigation('clientsBtn', 'manage_clients')
                    }
                    sx={{
                        color: 'white',
                        backgroundColor:
                            activeId === 'clientsBtn' ? 'orange' : 'gray',
                    }}
                />
                <BottomNavigationAction
                    color="primary"
                    id="logoutBtn"
                    label="Logout"
                    onClick={handleLogout}
                    sx={{
                        color: 'white',
                    }}
                />
            </BottomNavigation>

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

export default AdminDashboard;
