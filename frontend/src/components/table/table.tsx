import type { Item } from "../../models/types";
import { deleteItem, editItem, fetchItems } from "../../api/dataApi";
import { useState } from "react";
 import {
  Paper,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Stack,
} from "@mui/material";

type setData = React.Dispatch<React.SetStateAction<Item[]>>;

export function Table({ data, setData }: { data: Item[]; setData: setData }) {
  const [editRow, setEditRow] = useState<Item["id"] | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  async function handleEdit(row: Item) {
    setEditRow(row.id);
    setEditingItem(row);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditingItem((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function handleSave() {
    if (editingItem === null) return;
    await editItem(editingItem.id, editingItem);
    const fetchedItems = await fetchItems();
    setData(fetchedItems.items);
    setEditRow(null);
  }

  async function handleDelete(row: Item) {
    await deleteItem(row.id)
    const fetchedItems = await fetchItems()
    setData(fetchedItems.items)
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <p>No data available</p>;
  }



return (
  <Paper elevation={3}>
    <MuiTable>
      <TableHead>
        <TableRow>
          {Object.keys(data[0]).map((key) => (
            <TableCell key={key}>{key}</TableCell>
          ))}
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id as string | number}>
            {Object.entries(row).map(([key, value]) => {
              const itemKey = key as keyof Item;

              return (
                <TableCell key={key}>
                  {editRow === row.id ? (
                    <TextField
                      size="small"
                      name={itemKey}
                      value={editingItem?.[itemKey] ?? ""}
                      onChange={handleChange}
                    />
                  ) : (
                    value
                  )}
                </TableCell>
              );
            })}

            <TableCell>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => handleEdit(row)}
                >
                  Edit
                </Button>

                {editRow === row.id && (
                  <Button
                    variant="contained"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                )}

                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => handleDelete(row)}
                >
                  Delete
                </Button>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </MuiTable>
  </Paper>
)};