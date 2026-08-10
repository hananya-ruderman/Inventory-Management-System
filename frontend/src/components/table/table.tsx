import { useMemo, useState } from "react";
import type { Item } from "../../models/types";

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
  Toolbar,
} from "@mui/material";

type Props = {
  data: Item[];
  onDelete: (item: Item) => void;
  onUpdate: (item: Item) => void;
};

export function InventoryTable({ data, onDelete, onUpdate }: Props) {
  const [search, setSearch] = useState("");
  const [editRow, setEditRow] = useState<number | string>("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  function handleEdit(row: Item) {
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

  function handleSave() {
    if (!editingItem) return;

    onUpdate(editingItem);

    setEditRow("");
    setEditingItem(null);
  }

  const tableData = useMemo(
    () =>
      data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  );

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 0,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <h3>Products Table</h3>

        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Toolbar>
      <MuiTable
        sx={{
          minWidth: 700,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            tableData.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                  ...(editRow === row.id && {
                    backgroundColor: "action.hover",
                  }),
                }}
              >
                <TableCell
                  sx={{
                    width: "30%",
                    fontWeight: 500,
                  }}
                >
                  {editRow === row.id ? (
                    <TextField
                      size="small"
                      fullWidth
                      name="name"
                      value={editingItem?.name ?? ""}
                      onChange={handleChange}
                    />
                  ) : (
                    row.name
                  )}
                </TableCell>

                <TableCell align="center" sx={{ width: "20%" }}>
                  {editRow === row.id ? (
                    <TextField
                      size="small"
                      type="number"
                      name="price"
                      value={editingItem?.price ?? ""}
                      onChange={handleChange}
                    />
                  ) : (
                    `₪${row.price}`
                  )}
                </TableCell>

                <TableCell align="center" sx={{ width: "20%" }}>
                  {editRow === row.id ? (
                    <TextField
                      size="small"
                      type="number"
                      name="quantity"
                      value={editingItem?.quantity ?? ""}
                      onChange={handleChange}
                    />
                  ) : (
                    row.quantity
                  )}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: "30%",
                  }}
                >
                  <Stack
                    sx={{
                      justifyContent: "center",
                    }}
                    direction="row"
                    spacing={1}
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
                      variant="outlined"
                      color="error"
                      onClick={() => onDelete(row)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </MuiTable>
    </Paper>
  );
}
