import type { Item } from "../models/types";

export function totalValue(items: Pick<Item, 'price' | 'stock'>[]): number {
    return items.reduce((total, item) => total + item.price * item.stock, 0);
}

export function findOutOfStock(items: Item[]): Item[] {
    return items.filter(item => item.stock === 0);
}