import api from "./apiConfig";
import type { Item, NewItem } from "../models/types";

export async function fetchItems(signal?: AbortSignal) {
    const response = await api.get('/items', {signal});
    return response.data;
}

export async function editItem(id: Item['id'], item: Item){
    const response = await api.put(`/items/${id}`, item)
    return response.data
}

export async function addItem(item: NewItem){
    const response = await api.post(`/items`, item)
    return response.data
}

export async function deleteItem(id: Item['id']){
    const response = await api.delete(`/items/${id}`)
    return response.data
}