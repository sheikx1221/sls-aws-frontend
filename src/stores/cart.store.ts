import { makeAutoObservable } from "mobx";
import {
  addToCartAPI,
  deleteCartItemAPI,
  getCartItemsFromAPI,
  updateCartItemAPI,
} from "../services/cart";
import type { CartItem } from "../types/cart";
import type { Handicrafts } from "../types/handicrafts";

class Cart {
  private cartItems: CartItem[] = [];
  private states = {
    loading: { add: false, delete: false, get: false, update: false },
    error: { add: "", delete: "", get: "", update: "" },
  };

  constructor() {
    makeAutoObservable(this);
  }

  getStates() {
    return this.states;
  }

  checkInCart(craftId: string) {
    return !!this.cartItems.find(({ craft }) => craft.craftId == craftId);
  }

  async addItemToCart(item: Handicrafts, qty: number = 1) {
    this.states.loading.add = true;
    const response = await addToCartAPI(item, qty);

    this.states.loading.add = false;
    if ('error' in response) {
      this.states.error.add = response.error;
      return null;
    }
    else {
      this.cartItems.push(response);
      return response;
    }
  }

  async deleteItemFromCart(cartId: string) {
    this.states.loading.delete = true;
    const response = await deleteCartItemAPI(cartId);
    this.states.loading.delete = false;

    if ("error" in response) this.states.error.delete = response.error;
    else {
      const index = this.cartItems.findIndex((cart) => cart.cartId == cartId);
      this.cartItems.splice(index, 1);
      return true;
    }
  }

  async getCartItem(craftId: string) {
    if (this.cartItems.length > 0) {
      return this.cartItems.find(({ craft }) => craft.craftId == craftId);
    }

    this.states.loading.get = true;
    const response = await getCartItemsFromAPI();
    this.states.loading.get = false;
    if ("error" in response) this.states.error.get = response.error;
    else {
      this.cartItems = response.items;
      return this.cartItems.find(({ craft }) => craft.craftId == craftId);
    }
  }

  async updateItemInCart(cartId: string, qty: number) {
    this.states.loading.update = true;
    const response = await updateCartItemAPI(cartId, qty);
    this.states.loading.update = false;

    if ("error" in response) this.states.error.update = response.error;
    else {
      const index = this.cartItems.findIndex((cart) => cart.cartId == cartId);
      this.cartItems[index] = response.item;
      return response.item;
    }
  }
}

export const cartStore = new Cart();