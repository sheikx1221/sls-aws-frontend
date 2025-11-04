import type { CartItem } from "../types/cart";

export function manageCart(items: CartItem[]) {
    const mapItems = new Map<string, CartItem>();

    for (let item of items) {
        const value = mapItems.get(item.craft.craftId);
        if (value) {
            mapItems.set(item.craft.craftId, { 
                ...value,
                qty: item.qty + value.qty,
                amount: item.amount + value.amount,
                unitPrice: item.amount / item.qty
            });
        }
        else {
            mapItems.set(item.craft.craftId, {
                ...item,
                unitPrice: item.amount / item.qty
            });
        }
    }
    console.log("mapItems = ",mapItems);

    return [...mapItems.values()];
}