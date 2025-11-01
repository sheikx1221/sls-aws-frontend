import type { CartItem } from "../types/cart";
import type { Handicrafts } from "../types/handicrafts";
import fingerprint from "../utils/fingerprint";
import { get, post, put } from "./api";

type RESPONSE_LIST = {
    count: number;
    items: CartItem[],
    lastEvaluatedKey: string | null
}

type RESPONSE_UPDATE = {
    message: string,
    item: CartItem
}

export async function addToCartAPI(handicraft: Handicrafts, qty: number = 1) {
    const response = await post('/carts', {
        qty,
        amount: handicraft.price,
        craftName: handicraft.name,
        image: handicraft.images[0],
        craftId: handicraft.craftId,
        category: handicraft.category,
        deviceFingerprint: fingerprint,
    });

    return response.success;
}

export async function getCartItemsFromAPI() {
    const response = await get<RESPONSE_LIST>(`/carts?deviceFingerprint=${fingerprint}`);
    if (response.success && response.result) return response.result;
    else return { error: response.err };
}

export async function updateCartItemAPI(cartId: string, qty: number) {
    const response = await put<any, RESPONSE_UPDATE>(`/carts?cartId=${cartId}&qty=${qty}`);
    if (response.success && response.result) return response.result;
    else return { error: response.err };
}