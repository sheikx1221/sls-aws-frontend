export type CartItem = {
    cartId: string,
    deviceFingerprint: string,
    craft: {
        craftId: string,
        name: string,
        category: string,
        image: string
    }
    qty: number,
    amount: number,
    createdAt: string,
    updatedAt: string,

    unitPrice?: number;
}

export type CartItemModify = CartItem & { action: "D" | "U" }