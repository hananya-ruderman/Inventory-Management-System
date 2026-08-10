import { register } from "../../api/registerApi";
import { useNavigate } from "react-router";
import { useState } from "react";
import logger from "../../utils/logging";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

type RegisterForm = {
  username: string;
  password: string;
};

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleRegister() {
    setError(null);

    if (!form.username || !form.password) {
      setError("Username and password are required");
      return;
    }

    try {
      await register({
        username: form.username,
        password: form.password
      });
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        logger.warn("Registration failed:", error.message);
        setError(error.message);
      } else {
        logger.warn("Registration failed:", error);
        setError("An unknown error occurred");
      }
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        maxWidth: 400,
        mx: "auto",
        mt: 8,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Username"
          value={form.username}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              username: e.target.value,
            }))
          }
          fullWidth
          margin="normal"
        />

        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          fullWidth
          margin="normal"
        />

        

        <Button
          variant="contained"
          fullWidth
          onClick={handleRegister}
          sx={{ mt: 2 }}
        >
          Register
        </Button>

        <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate("/login")}>
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
}
