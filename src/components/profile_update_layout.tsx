import { Stack, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import Database from "../database/supabase_db";

function UpdateProfile() {
  const db = new Database();
  const [newName, setNewName] = useState<string>("");
  const [newPhone, setNewPhone] = useState<number>(0);

  const handleUpdate = async () => {
    //check if both number and name are filled
    if (
      newName !== null &&
      newName.length > 0 &&
      newPhone.toString().trim().length >= 9
    ) {
      const res = await db.updateCounsellorProfile({
        name: newName,
        phone_number: newPhone.toString(),
      });
      if (res === true) {
        return window.alert("Name and Number updated");
      }
      return window.alert(res);
    }

    //check if number is filled
    if (newPhone.toString().trim().length >= 9) {
      const res = await db.updateCounsellorProfile({
        name: null,
        phone_number: newPhone.toString(),
      });
      if (res === true) {
        return window.alert("Number updated");
      }
      return window.alert(res);
    }

    // check if name is filled
    if (newName !== null && newName.length > 0) {
      const res = await db.updateCounsellorProfile({
        name: newName,
        phone_number: null,
      });
      if (res === true) {
        return window.alert("Name updated");
      }
      return window.alert(res);
    }

    //return error
    return window.alert("Please enter either a name or number to update");
  };

  return (
    <>
      <Stack spacing={2} sx={{ padding: "2%" }}>
        <Typography>Update your name or your phone number or both</Typography>
        <TextField
          required
          helperText="New Name"
          type="text"
          value={newName}
          onChange={(v) => setNewName(v.target.value)}
        />
        <TextField
          required
          type="number"
          helperText="New Phone Number"
          value={newPhone}
          onChange={(v) => setNewPhone(Number(v.target.value))}
        />

        <Stack direction={"row"}>
          <Button onClick={handleUpdate}>Update</Button>
        </Stack>
      </Stack>
    </>
  );
}

export default UpdateProfile;
