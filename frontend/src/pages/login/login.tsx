import { useState } from "react";
import { login } from "../../api/loginApi";
import { useNavigate } from "react-router";
import "./login.css";
import { useUser } from "../../state/user";
import logger from '../../utils/logging'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";


export default function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useUser();
  const [error, setError] = useState<Error | null>(null);

  async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    if (!password || !username) {
      setError(new Error("Password and username are required"));
      return;
    }
    try {
      const user = await login(username as string, password as string);
      setCurrentUser(user.username);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        logger.warn("Login failed:", error.message);
        setError(error);
      } else {
        logger.warn("Login failed:", error);
        setError(new Error("An unknown error occurred"));
      }
    }
  }

 
return (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "background.default"
    }}
  >
    <Paper
      elevation={3}
      sx={{
        p: 4,
        width: 400,
      }}
    >
      <Typography sx={{variant:"h4", mb: 3}}>
        Login
      </Typography>

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Username"
          name="username"
          fullWidth
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
        />

        {error && (
          <Typography color="error">
            {error.message}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
        >
          Login
        </Button>

        <Button
          variant="text"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </Box>
    </Paper>
  </Box>
);
}
