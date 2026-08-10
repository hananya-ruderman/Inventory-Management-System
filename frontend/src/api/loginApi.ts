import api from "./apiConfig";

export async function login(username: string, password: string) {
    const response = await api.post('/login', { username, password });
    return response.data;
}