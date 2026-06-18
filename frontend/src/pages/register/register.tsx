import { register } from "../../api/registerApi";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { theme } from "../../muiUtils/theme";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const navigate = useNavigate();

  async function handleRegister() {
    if (!username || !password) {
      alert("Username and password are required");
      return;
    }
    try {
      await register({ username, password, role });
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration failed:", error.message);
        alert(`Registration failed: ${error.message}`);
      } else {
        console.error("Registration failed:", error);
        alert("Registration failed: An unknown error occurred");
      }
    }
  }

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.primary,
        maxWidth: 400,
        mx: "auto",
        mt: 8,
      })}
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

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>

        <Select
          value={role}
          label="Role"
          onChange={(e) => setRole(e.target.value as "admin" | "user")}
        >
          <MenuItem value="user">User</MenuItem>

          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>

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
