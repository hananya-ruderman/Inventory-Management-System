import api from "./apiConfig";

export async function fetchItems() {
    const response = await api.get('/items');
    return response.data;
}