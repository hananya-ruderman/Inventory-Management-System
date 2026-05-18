import api from "./apiConfig";
import type {User} from "../models/types";

type UserRegister = Omit<User, 'id'> & Partial<Pick<User, 'role'>>;


export async function register(user: UserRegister) {
    const response = await api.post('users', user);
    return response.data;
}