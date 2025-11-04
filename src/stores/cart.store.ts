import { makeAutoObservable } from "mobx";
import {
  addToCartAPI,
  deleteCartItemAPI,
  getCartItemsFromAPI,
  modifyCartItemsAPI,
  updateCartItemAPI,
} from "../services/cart";
import type { CartItem, CartItemModify } from "../types/cart";
import type { Handicrafts } from "../types/handicrafts";

class Cart {
  private cartItems: CartItem[] = [];
  private states = {
    loading: { add: false, delete: false, get: false, modify: false, update: false },
    error: { add: "", delete: "", get: "", modify: "", update: "" },
  };

  constructor() {
    makeAutoObservable(this);
    this.getCartItems();
  }

  getStates() {
    return this.states;
  }

  checkInCart(craftId: string) {
    return !!this.cartItems.find(({ craft }) => craft.craftId == craftId);
  }

  get quantity() {
    let sum = 0;
    for (let item of this.cartItems) {
      sum = sum + item.qty;
    }

    return sum;
  }

  get amount() {
    let sum = 0;
    for (let item of this.cartItems) {
      sum = sum + item.amount;
    }

    return sum;
  }

  async addItemToCart(item: Handicrafts, qty: number = 1) {
    this.states.loading.add = true;
    const response = await addToCartAPI(item, qty);

    this.states.loading.add = false;
    if ("error" in response) {
      this.states.error.add = response.error;
      return null;
    } else {
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

    await this.getCartItems();
    return this.cartItems.find(({ craft }) => craft.craftId == craftId);
  }

  async getCartItems() {
    if (this.cartItems.length > 0) return this.cartItems;

    this.states.error.get = "";
    this.states.loading.get = true;
    const response = await getCartItemsFromAPI();
    this.states.loading.get = false;
    if ("error" in response) {
      this.states.error.get = response.error;
      return null;
    }
    else {
      this.cartItems = response;
      return response;
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

  async compareAndSave(cartItems: CartItem[]) {
    const items: CartItemModify[] = [];
    for (let item of this.cartItems) {
      const itemUpdate = cartItems.find((cart) => cart.cartId == item.cartId)!;
      if (itemUpdate.qty == 0) items.push({
        ...itemUpdate,
        action: 'D'
      });
      else {
        if (itemUpdate.qty !== item.qty) items.push({
          ...itemUpdate,
          action: 'U'
        });
      }
    }

    this.states.loading.modify = true;
    const response = await modifyCartItemsAPI(items);
    this.states.loading.modify = false;

    if ('error' in response) {
      this.states.error.modify = response.error;
      return null;
    }
    else {
      this.cartItems = response;
      return response;
    }
  }
}

export const cartStore = new Cart();