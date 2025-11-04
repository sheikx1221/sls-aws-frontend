import type { CartItem, CartItemModify } from "../types/cart";
import type { Handicrafts } from "../types/handicrafts";
import { manageCart } from "../utils/cart-functions";
import fingerprint from "../utils/fingerprint";
import { get, post, put, remove } from "./api";

type RESPONSE_CREATE = {
    message: string,
    item: any
}

type RESPONSE_LIST = {
    count: number;
    items: CartItem[],
    lastEvaluatedKey: string | null
}

type RESPONSE_UPDATE = {
    message: string,
    item: CartItem
}

type RESPONSE_DELETE = {
    message: string,
    item: CartItem
}

export async function addToCartAPI(handicraft: Handicrafts, qty: number = 1) {
    const response = await post<any, RESPONSE_CREATE>('/carts', {
        qty,
        amount: handicraft.price,
        craftName: handicraft.name,
        image: handicraft.images[0],
        craftId: handicraft.craftId,
        category: handicraft.category,
        deviceFingerprint: fingerprint,
    });

    if (response.success && response.result) {
        const cart = manageCart([response.result.item]);
        return cart[0];
    }
    else return { error: response.err };
}

export async function getCartItemsFromAPI() {
    const response = await get<RESPONSE_LIST>(`/carts?deviceFingerprint=${fingerprint}`);
    if (response.success && response.result) {
        const cart = manageCart(response.result.items);
        return cart;
    }
    else return { error: response.err };
}

export async function updateCartItemAPI(cartId: string, qty: number) {
    const response = await put<any, RESPONSE_UPDATE>(`/carts?cartId=${cartId}&qty=${qty}`);
    if (response.success && response.result) return response.result;
    else return { error: response.err };
}

export async function deleteCartItemAPI(cartId: string) {
    const response = await remove<RESPONSE_DELETE>(`/carts?cartId=${cartId}`);
    if (response.success && response.result) return response.result;
    else return { error: response.err };  
}

export async function modifyCartItemsAPI(cartItems: CartItemModify[]) {
    const response = await post<any, RESPONSE_LIST>(`/carts/modify`, { cartItems });
    if (response.success && response.result) {
        const cart = manageCart(response.result.items);
        return cart;
    }
    else return { error: response.err };
}