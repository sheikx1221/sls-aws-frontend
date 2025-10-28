import fingerprint from "../utils/fingerprint";
import { post } from "./api";

export async function addToCart(craftId: string, price: number) {
    const response = await post('/carts', {
        craftId,
        deviceFingerprint: fingerprint,
        qty: 1,
        amount: price, 
    });

    return response.success;
}