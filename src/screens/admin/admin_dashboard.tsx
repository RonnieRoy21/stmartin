import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState<string>('');

    const handleNavigation = (id: string, path: string) => {
        setActiveId(id);
        navigate(path);
    };
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
            </BottomNavigation>
        </>
    );
}

export default AdminDashboard;
