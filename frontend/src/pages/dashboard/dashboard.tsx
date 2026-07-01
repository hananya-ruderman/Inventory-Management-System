import "./dashboard.css";
import { useUser } from "../../state/user";
import { Table } from "../../components/table/table";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Model from "../../components/model/Model";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Dialog,
} from "@mui/material";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", currentUser);
    } else {
      const stored = localStorage.getItem("currentUser");
      if (stored) setCurrentUser(stored);
    }
  }, [currentUser]);

  
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  

  
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed">
        <Toolbar>
          <Box
            component="img"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Mazpenlogo.png/500px-Mazpenlogo.png"
            alt="Logo"
            sx={{
              height: 40,
              mr: 3,
            }}
          />

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {currentUser}!
          </Typography>

          

          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{ ml: 3 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width:240,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            mt: 8,
          },
        }}
      >
        <List>
          {["Home", "Products", "Orders", "Customers", "Reports"].map(
            (item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ),
          )}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">Dashboard</Typography>

          <Button
            variant="contained"
            disabled={isOpen}
            onClick={() => setIsOpen(true)}
          >
            Add Item
          </Button>
        </Box>

        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          maxWidth="sm"
        >
          <Model
  setIsOpen={setIsOpen}
  onSuccess={() => setRefresh(prev => prev + 1)}
/>
        </Dialog>

<Table refresh={refresh}/>      </Box>
    </Box>
  );
}
