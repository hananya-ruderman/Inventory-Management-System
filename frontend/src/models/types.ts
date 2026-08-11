export interface Item {
    id: string | number;
    name: string;
    price: number;
    stock: number;
}

export interface User {
    id: string;
    username: string;
    password: string;
}

export type NewItem = Omit<Item, "id">


