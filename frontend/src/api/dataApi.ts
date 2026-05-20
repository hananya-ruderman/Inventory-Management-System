import api from "./apiConfig";
import type { Item } from "../models/types";

export async function fetchItems() {
    const response = await api.get('/items');
    return response.data;
}

export async function editItem(id: Item['id'], item: Item){
    const response = await api.put(`/items/${id}`, item)
    console.log(response.data);
    return response.data
}

export async function deleteItem(id: Item['id']){
    const response = await api.delete(`/items/${id}`)
    console.log(response.data);
    return response.data
}