import "./dashboard.css";
import { useUser } from "../../state/user";
import { Table } from "../../components/table/table";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchItems } from "../../api/dataApi";
import type { Item } from "../../models/types";
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
  TextField,
  Button,
  Dialog,
} from "@mui/material";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();
  const [data, setData] = useState<Item[]>([]);
  const [filteredData, setFilteredData] = useState<Item[] | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", currentUser);
    } else {
      const stored = localStorage.getItem("currentUser");
      if (stored) setCurrentUser(stored);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    const searchedData = data.filter((item: Item) => {
      return item.name.includes(query);
    });
    setFilteredData(searchedData);
  }

  async function loadData() {
    try {
      const items = await fetchItems();
      setData(items.items);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
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

          <TextField
            placeholder="Search..."
            onChange={handleSearch}
            sx={{
              backgroundColor: "background.default",
              borderRadius: 1,
            }}
          />

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
          width: 240,
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
          fullWidth
        >
          <Model setIsOpen={setIsOpen} onSuccess={loadData} />
        </Dialog>

        <Table data={filteredData ?? data} setData={setData} />
      </Box>
    </Box>
  );
}
