import { Route, Routes } from 'react-router';
import SignUpForm from './screens/counsellor/sign_up_form';
import LoginForm from './components/login_form';
import MainScreen from './screens/counsellor/main_screen';
import EventsPage from './screens/counsellor/events';
import SchedulesPage from './screens/counsellor/schedules';
import HomePage from './screens/counsellor/home';
import AdminLogin from './components/admin_login';
import ViewCounsellors from './screens/admin/view_counsellors';
import ManageEvents from './screens/admin/manage_events';
import AdminDashboard from './screens/admin/admin_dashboard';
import ManageSchedules from './screens/admin/manage_schedules';
import AdminMainScreen from './screens/admin/admin_mainscreen';
import ProfilePage from './screens/counsellor/profile';
import ViewProfile from './components/view_profile';
import UpdateProfile from './components/profile_update_layout';
import PickClient from './screens/counsellor/pick_client';
import ManageClients from './screens/admin/manage_clients';

function App() {
    return (
        <Routes>
            <Route index path="/" element={<LoginForm />} />
            <Route path="/signUp" element={<SignUpForm />} />

            {/**admin routes */}
            <Route path="/admin" element={<AdminMainScreen />}>
                <Route index element={<AdminLogin />} />

                <Route path="dashboard" element={<AdminDashboard />}>
                    {/* Dashboard routes */}
                    <Route index element={<ViewCounsellors />} />
                    <Route
                        path="manage_schedules"
                        element={<ManageSchedules />}
                    />
                    <Route path="manage_events" element={<ManageEvents />} />
                    <Route path="manage_clients" element={<ManageClients />} />
                </Route>
            </Route>

            {/**client routes */}
            <Route path="/home" element={<MainScreen />}>
                <Route index element={<HomePage />} />
                <Route path="schedules" element={<SchedulesPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="clients" element={<PickClient />} />
                <Route path="profile" element={<ProfilePage />}>
                    <Route index element={<ViewProfile />} />
                    <Route path="update" element={<UpdateProfile />} />
                </Route>
            </Route>
        </Routes>
    );
}
export default App;
