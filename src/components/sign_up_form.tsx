import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import Database from "../database/supabase_db";

const textFieldStyles = {
  marginLeft: "15%",
  marginRight: "15%",
  marginBottom: "2%",
  maxWidth: "60%",
};
const db = new Database();
function SignUpForm() {
  const navigate = useNavigate();

  // fields for sign up values
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number>(0);
  const [password, setPassword] = useState<string>("");

  const handleSignUp = async () => {
    if (name.trim().length === 0) {
      window.alert("Please enter your Name");
      return;
    }
    if (email.trim().length === 0) {
      window.alert("Please enter your Email");
      return;
    }
    if (phoneNumber.toString().trim().length < 9) {
      window.alert("Invalid phone Number");
      return;
    }
    if (password.trim().length < 6) {
      window.alert("Passowrd too short");
      return;
    }
    console.log("About to sign up...");

    const response = await db.createAccount(
      {
        name: name,
        phone_number: String(phoneNumber),
        email: email,
      },
      password,
    );

    if (response === true) {
      window.alert("Sign up complete.You can login");
      navigate("/");
    } else {
      window.alert(response);
    }
  };

  return (
    <>
      <Stack
        sx={{
          padding: "1%",
          height: "100%",
          backgroundColor: "beige",
          backgroundBlendMode: "saturation",
        }}
      >
        <Typography
          sx={{
            color: "blue",
          }}
        >
          Create an Account
        </Typography>
        <TextField
          required
          id="nameController"
          type="text"
          variant="outlined"
          label="Your Full Name"
          onChange={(newText) => setName(newText.target.value)}
          sx={textFieldStyles}
        />
        <TextField
          required
          id="emailController"
          type="email"
          variant="outlined"
          label="Your Email"
          onChange={(newMail) => setEmail(newMail.target.value)}
          sx={textFieldStyles}
        />

        <TextField
          required
          id="phoneController"
          type="number"
          variant="outlined"
          label="Your Phone Number"
          onChange={(newPhone) => setPhoneNumber(Number(newPhone.target.value))}
          sx={textFieldStyles}
        />
        <TextField
          required
          id="passwordController"
          type="password"
          label="password"
          variant="outlined"
          onChange={(newPass) => setPassword(newPass.target.value)}
          sx={textFieldStyles}
        />
        <Button
          variant="outlined"
          sx={{
            marginLeft: "40%",
            marginRight: "40%",
            color: "blue",
            backgroundColor: "orange",
          }}
          onClick={() => {
            handleSignUp();
          }}
        >
          Done
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            color: "blue",
            marginLeft: "10%",
            marginRight: "10%",
            marginTop: "5%",
            marginBottom: "5%",
            fontStyle: "italic",
            fontSize: "70%",
          }}
        >
          {" "}
          Back to login
        </Button>
      </Stack>
    </>
  );
}

export default SignUpForm;
