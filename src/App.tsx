import { Route, Routes } from "react-router";
import SignUpForm from "../src/components/sign_up_form";
import LoginForm from "./components/login_form";
import MainScreen from "./screens/client/main_screen";
// import ViewProfile from './components/profile_layout'
import EventsPage from "./screens/client/events";
import SchedulesPage from "./screens/client/schedules";
import HomePage from "./screens/client/home";
import AdminLogin from "./components/admin_login";
import ViewCounsellors from "./screens/admin/view_counsellors";
import ManageEvents from "./screens/admin/manage_events";
import AdminDashboard from "./screens/admin/admin_dashboard";
import ManageSchedules from "./screens/admin/manage_schedules";
import AdminMainScreen from "./screens/admin/admin_mainscreen";
import ProfilePage from "./screens/client/profile";
import ViewProfile from "./components/view_profile";
import UpdateProfile from "./components/profile_update_layout";

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
          <Route path="manage_schedules" element={<ManageSchedules />} />
          <Route path="manage_events" element={<ManageEvents />} />
        </Route>
      </Route>

      {/**client routes */}
      <Route path="/home" element={<MainScreen />}>
        <Route index element={<HomePage />} />
        <Route path="schedules" element={<SchedulesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="profile" element={<ProfilePage />}>
          <Route index element={<ViewProfile />} />
          <Route path="update" element={<UpdateProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}
export default App;
