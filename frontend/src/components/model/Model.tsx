import { useState, type SetStateAction } from "react";
import { addItem } from "../../api/dataApi";

import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
type status = "idle" | "loading" | "success" | "error";

export default function Model({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [name, setName] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string | null>(null);
  const [status, setStatus] = useState<status>("idle");
  const [isRequired, setIsRequired] = useState<boolean>(false);

  async function handleSave() {
    if (!name || !price) {
      setIsRequired(true);
      return;
    }
    setIsRequired(false);
    setStatus("loading");
    const newItem = { name, price: +price, quantity: quantity ? +quantity : 0 };

    try {
      await addItem(newItem);
      setStatus("success");
      setTimeout(() => {
        setIsOpen(false);
      
      }, 2000);
    } catch (error) {
      setStatus("error");

      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }
  }

  return (
    <Box
      sx={{
        p: 3,
        width: 400,
      }}
    >
      {status === "idle" && (
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">New Item</Typography>

            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Name"
            required
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={isRequired && !name}
            helperText={isRequired && !name ? "Name is required" : ""}
          />

          <TextField
            label="Price"
            required
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={isRequired && !price}
            helperText={isRequired && !price ? "Price is required" : ""}
          />

          <TextField
            label="Quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      )}

      {status === "loading" && <Alert severity="info">Adding item...</Alert>}

      {status === "success" && (
        <Alert severity="success">Item added successfully</Alert>
      )}

      {status === "error" && (
        <Alert severity="error">Error in adding item</Alert>
      )}
    </Box>
  );
}
