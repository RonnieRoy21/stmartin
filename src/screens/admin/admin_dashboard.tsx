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
                }}
            >
                <BottomNavigationAction
                    id="counsellorsBtn"
                    label="Counsellors"
                    sx={{
                        backgroundColor:
                            activeId === 'counsellorsBtn'
                                ? 'orange'
                                : 'whitesmoke',
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
                        backgroundColor:
                            activeId === 'schedulesBtn'
                                ? 'orange'
                                : 'whitesmoke',
                    }}
                />
                <BottomNavigationAction
                    id="eventsBtn"
                    label="Events"
                    onClick={() =>
                        handleNavigation('eventsBtn', 'manage_events')
                    }
                    sx={{
                        backgroundColor:
                            activeId === 'eventsBtn' ? 'orange' : 'whitesmoke',
                    }}
                />
                <BottomNavigationAction
                    id="clientsBtn"
                    label="Clients"
                    onClick={() =>
                        handleNavigation('clientsBtn', 'manage_clients')
                    }
                    sx={{
                        backgroundColor:
                            activeId === 'eventsBtn' ? 'orange' : 'whitesmoke',
                    }}
                />
            </BottomNavigation>
        </>
    );
}

export default AdminDashboard;
