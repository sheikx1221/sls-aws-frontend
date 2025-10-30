import type { CartItem } from "../types/cart";
import type { Handicrafts } from "../types/handicrafts";
import fingerprint from "../utils/fingerprint";
import { get, post } from "./api";

type RESPONSE_LIST = {
    count: number;
    items: CartItem[],
    lastEvaluatedKey: string | null
}

export async function addToCartAPI(handicraft: Handicrafts) {
    const response = await post('/carts', {
        qty: 1,
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