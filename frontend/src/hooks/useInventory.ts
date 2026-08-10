import { useState, useEffect } from "react";
import axios from "axios";
import {
  fetchItems,
  deleteItem,
  editItem,
  addItem as addItemApi,
} from "../api/dataApi";
import type { Item, NewItem } from "../models/types";
import logger from "../utils/logging";

export function useInventory() {
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    loadData(controller.signal);

    return () => controller.abort();
  }, []);

  async function loadData(signal: AbortSignal) {
    try {
      const items = await fetchItems(signal);
      setData(items);
    } catch (error) {
      if (axios.isCancel(error)) return;

      logger.warn("Failed to fetch items", error);
    }
  }

  async function addItem(item: NewItem) {
    try {
      const res = await addItemApi(item);

      setData((prev) => [...prev, res.item]);
    } catch (error) {
      logger.warn("Failed add", error);
    }
  }

  async function updateItem(item: Item) {
    try {
      const res = await editItem(item.id, item);

      setData((prev) =>
        prev.map((i) => (i.id === res.updatedItem.id ? res.updatedItem : i)),
      );
    } catch (error) {
      logger.warn("Failed update", error);
    }
  }

  async function removeItem(item: Item) {
    try {
      const res = await deleteItem(item.id);

      setData((prev) => prev.filter((i) => i.id !== res.item.id));
    } catch (error) {
      logger.warn("Failed delete", error);
    }
  }

  return {
    data,
    addItem,
    updateItem,
    removeItem,
  };
}
