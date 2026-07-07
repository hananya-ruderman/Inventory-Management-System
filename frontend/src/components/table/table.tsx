import type { Item } from "../../models/types";
import { deleteItem, editItem, fetchItems } from "../../api/dataApi";
import { connectSocket } from "../../api/socket";
import { useState, useEffect } from "react";
import logger from "../../utils/logging";

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

export function Table({ refresh }: { refresh: number }) {
  const [data, setData] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [editRow, setEditRow] = useState<Item["id"] | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  useEffect(() => {
    loadData();

    connectSocket((message) => {
      if (message.type === "inventoryChanged") {
        loadData();
      }
    });
  }, [refresh]);

  async function loadData() {
    try {
      const items = await fetchItems();
      setData(items);
    } catch (error) {
      logger.warn("Failed to fetch items:", error);
    }
  }

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
    if (!editingItem) return;

    try {
      await editItem(editingItem.id, editingItem);

      const updatedData = await fetchItems();
      setData(updatedData);

      setEditRow(null);
      setEditingItem(null);
    } catch (error) {
      logger.warn("Failed to edit item:", error);
    }
  }

  async function handleDelete(row: Item) {
    try {
      await deleteItem(row.id);

      const updatedData = await fetchItems();

      setData(updatedData);
    } catch (error) {
      logger.warn("Failed to delete item:", error);
    }
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  if (!data.length) {
    return <p>No data available</p>;
  }

  const tableData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <MuiTable>
        <TableHead>
          <TableRow>
            <TableCell colSpan={Object.keys(data[0]).length + 1} sx={{ py: 1 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>Products Table</h3>

                <TextField
                  size="small"
                  placeholder="Search..."
                  onChange={handleSearch}
                  sx={{
                    width: 250,
                    backgroundColor: "background.default",
                    borderRadius: 1,
                  }}
                />
              </Stack>
            </TableCell>
          </TableRow>

          <TableRow>
            {Object.keys(data[0]).map((key) => (
              <TableCell key={key}>{key}</TableCell>
            ))}

            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.map((row) => (
            <TableRow key={row.id} hover>
              {Object.entries(row).map(([key, value]) => {
                const itemKey = key as keyof Item;

                return (
                  <TableCell key={key}>
                    {editRow === row.id &&
                    ["name", "price", "stock"].includes(key) ? (
                      <TextField
                        size="small"
                        name={key}
                        value={editingItem?.[itemKey] ?? ""}
                        onChange={handleChange}
                      />
                    ) : (
                      value
                    )}
                  </TableCell>
                );
              })}

              <TableCell align="center">
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent: "center",
                  }}
                >
                  {editRow !== row.id && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEdit(row)}
                    >
                      Edit
                    </Button>
                  )}

                  {editRow === row.id && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  )}

                  <Button
                    size="small"
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
  );
}
