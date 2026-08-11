import { useState, type SetStateAction } from "react";
import type { NewItem } from "../../models/types";
import {
  STATUS,
  MESSAGESE,
  FORM_FIELDS,
  FORM_LABELS,
} from "../../utils/messages";

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

type Status = (typeof STATUS)[keyof typeof STATUS];

interface ModelProps {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  onSuccess: (item: NewItem) => void;
}

interface FormState {
  name: string;
  price: string;
  stock: string;
}

export default function Model(props: ModelProps) {
  const { setIsOpen, onSuccess } = props;

  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    stock: "",
  });
  const [status, setStatus] = useState<Status>(STATUS.IDLE);
  const [isRequired, setIsRequired] = useState<boolean>(false);

  async function handleSave() {
    if (!form.name || !form.price) {
      setIsRequired(true);
      return;
    }

    setIsRequired(false);
    setStatus(STATUS.LOADING);

    const newItem: NewItem = {
      name: form.name,
      price: +form.price,
      stock: form.stock ? +form.stock : 0,
    };

    try {
      onSuccess(newItem);

      setStatus(STATUS.SUCCESS);

      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      setStatus(STATUS.ERROR);

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
      {status === STATUS.IDLE && (
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">{MESSAGESE.ITEM.NEW_ITEM}</Typography>

            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label={FORM_LABELS.ITEM.NAME}
            required
            name={FORM_FIELDS.ITEM.NAME}
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            error={isRequired && !form.name}
            helperText={
              isRequired && !form.name ? MESSAGESE.VALIDATION.NAME_REQUIRED : ""
            }
          />

          <TextField
            label={FORM_LABELS.ITEM.PRICE}
            required
            name={FORM_FIELDS.ITEM.PRICE}
            value={form.price}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                price: e.target.value,
              }))
            }
            error={isRequired && !form.price}
            helperText={
              isRequired && !form.price
                ? MESSAGESE.VALIDATION.PRICE_REQUIRED
                : ""
            }
          />

          <TextField
            label={FORM_LABELS.ITEM.STOCK}
            name={FORM_FIELDS.ITEM.STOCK}
            value={form.stock}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                stock: e.target.value,
              }))
            }
          />

          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      )}

      {status === STATUS.LOADING && (
        <Alert severity="info">{MESSAGESE.ITEM.ADDING}</Alert>
      )}

      {status === STATUS.SUCCESS && (
        <Alert severity="success">{MESSAGESE.ITEM.ADDED_SUCCESSFULLY}</Alert>
      )}

      {status === STATUS.ERROR && (
        <Alert severity="error">{MESSAGESE.ITEM.ADD_ERROR}</Alert>
      )}
    </Box>
  );
}
