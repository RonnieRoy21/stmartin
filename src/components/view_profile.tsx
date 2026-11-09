import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { UserProfile } from "../models/profile_model";
import Database from "../database/supabase_db";

function ViewProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const db = new Database();

  //fetch profile
  useEffect(() => {
    const getProfile = async () => {
      const res = await db.fetchCounsellorById();
      if (typeof res === "string") {
        return window.alert(res);
      }
      setProfile(res);
    };
    getProfile();
  }, []);

  return (
    <>
      <Stack spacing={2} sx={{ padding: "2%" }}>
        {profile === null ? (
          <Typography>Loading Profile....</Typography>
        ) : (
          <Card sx={{ marginTop: "1%", color: "orange" }}>
            <CardContent>
              <Typography>Name: {profile.name}</Typography>
              <Typography>Email: {profile.email}</Typography>
              <Typography>Phone Number: {profile.phone_number}</Typography>
              <Typography>Registered as: {profile.role}</Typography>
            </CardContent>
          </Card>
        )}
      </Stack>
    </>
  );
}

export default ViewProfile;
