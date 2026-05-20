import type { Item } from "../../models/types";
import "./table.css";
import { deleteItem, editItem, fetchItems } from "../../api/dataApi";
import { useState } from "react";

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
    setData(fetchedItems);
    setEditRow(null);
  }

  async function handleDelete(row: Item) {
    await deleteItem(row.id)
    const fetchedItems = await fetchItems()
    setData(fetchedItems)
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id as string | number}>
            {Object.entries(row).map(([key, value]) =>{
            const itemKey = key as keyof Item
            return editRow === row.id ? (
                <td>
                  <input
                    name={itemKey}
                    value={editingItem?.[itemKey]}
                    onChange={handleChange}
                  />
                </td>
              ) : (
                <td>{value}</td>
              )
})}
            <td>
              <button onClick={() => handleEdit(row)}>Edit</button>
              {editRow && <button onClick={handleSave}>Save</button>}
              <button onClick={() => handleDelete(row)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
