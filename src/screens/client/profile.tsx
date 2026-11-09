import { Button, Stack } from "@mui/material";
import { Outlet, useNavigate } from "react-router";

function ProfilePage() {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate("");
  };

  const handleUpdateProfile = () => {
    navigate("update");
  };

  return (
    <>
      <Stack spacing={1} sx={{ paddingTop: "1%" }}>
        <Stack spacing={1} direction={"row"} sx={{ justifyContent: "center" }}>
          <Button variant="outlined" onClick={() => handleViewProfile()}>
            View profile
          </Button>
          <Button variant="outlined" onClick={() => handleUpdateProfile()}>
            Update profile
          </Button>
        </Stack>
        <Outlet />
      </Stack>
    </>
  );
}

export default ProfilePage;
