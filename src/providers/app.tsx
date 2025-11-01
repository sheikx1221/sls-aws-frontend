import { createContext, useEffect, useEffectEvent, useState } from "react";
import type { Handicrafts } from "../types/handicrafts";
import type { CartItem } from "../types/cart";
import { addToCartAPI, getCartItemsFromAPI, updateCartItemAPI } from "../services/cart";
import { manageCart } from "../utils/cart-functions";
import { getCraftFromAPI, getCraftsFromAPI } from "../services/home";
import { useLocation } from "react-router-dom";
import fingerprint from "../utils/fingerprint";

type AppContextType = {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  crafts: Handicrafts[];
  setCrafts: (crafts: Handicrafts[]) => void;
  error: { carts: string; crafts: string, craft: string, cart: string  };
  loading: { carts: boolean; crafts: boolean, craft: boolean, cart: boolean };

  reloadCrafts: () => void;
  checkInCart: (craftId: string) => boolean;
  getCraft: (craftId: string) => Promise<Handicrafts | null>;
  getCartItem: (craftId: string) => Promise<CartItem | null>;
  addToCart: (item: Handicrafts, qty: number) => Promise<CartItem | null>;
  updateCart: (cartId: string, qty: number) => Promise<CartItem | null>
};

export const AppContext = createContext<AppContextType>({
  cart: [],
  crafts: [],
  setCart: () => {},
  setCrafts: () => {},
  error: { carts: "", crafts: "", craft: "", cart: "", },
  loading: { carts: false, crafts: false, craft: false, cart: false},

  reloadCrafts: () => {},
  checkInCart: () => false,
  getCraft: async () => null,
  getCartItem: async () => null,
  addToCart: async () => null,
  updateCart: async () => null
});

interface Props {
  children: React.ReactNode | React.ReactNode[];
}
export function AppProvider(props: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [crafts, setCrafts] = useState<Handicrafts[]>([]);
  const [error, setError] = useState<AppContextType["error"]>({
    carts: "", crafts: "", craft: "", cart: ""
  });
  const [loading, setLoading] = useState<AppContextType["loading"]>({
    carts: false, crafts: false, craft: false, cart: false
  });

  const location = useLocation();
  const getCartItems = useEffectEvent(async () => {
    setCart([]);
    setLoading((prev) => ({ ...prev, carts: true }));
    const response = await getCartItemsFromAPI();
    if ("error" in response) {
      setError((prev) => ({ ...prev, carts: response.error }));
    } else {
      console.log("getCartItems response = ", response);
      setCart(manageCart(response.items));
    }
    setLoading((prev) => ({ ...prev, carts: false }));
  });
  const getCrafts = useEffectEvent(async () => {
    setCrafts([]);
    setError((prev) => ({ ...prev, crafts: "" }));
    setLoading((prev) => ({ ...prev, crafts: true }));
    const response = await getCraftsFromAPI();
    if ("error" in response) {
      setError((prev) => ({ ...prev, crafts: response.error }));
    } else {
      setCrafts(response);
    }
    setLoading((prev) => ({ ...prev, crafts: false }));
  });
  useEffect(() => {
    if (location.pathname == "/") {
        getCartItems();
        getCrafts();
    }
  }, [location]);

  const checkInCart = (craftId: string) => {
    const craftIds = cart.map(({ craft }) => craft.craftId);
    return craftIds.includes(craftId);
  };
  const addToCart = async (item: Handicrafts, qty: number = 1) => {
    setLoading((prev) => ({ ...prev, cart: true }));
    const added = await addToCartAPI(item, qty);
    setLoading((prev) => ({ ...prev, cart: false }));
    if (added) {
        const cart: CartItem = {
            amount: item.price,
            cartId: String(Date.now()), // Instead of another GET request from server for CartItem, making one because we have all information except ID
            craft: {
                category: item.category,
                craftId: item.craftId,
                image: item.images[0],
                name: item.name
            },
            createdAt: new Date().toISOString(),
            deviceFingerprint: String(fingerprint),
            qty,
            updatedAt: new Date().toISOString()
        }

        setCart((prev) => ([...prev, cart]));
        return cart;
    }
    else return null;
  }

  const getCraft = async (craftIdx: string) => {
    const craft = crafts.find(({ craftId }) => craftId == craftIdx);
    if (!craft) {
        setLoading((prev) => ({ ...prev, craft: true }));
        const response = await getCraftFromAPI(craftIdx);
        setLoading((prev) => ({ ...prev, craft: false }));
        if ('error' in response) {
            setError((prev) => ({ ...prev, craft: response.error }));
            return null;
        }
        else {
            setCrafts((prev) => ([...prev, response]));
            return response;
        }
    }
    else return craft;
  }
  const getCartItem = async (craftIdx: string) => {
    if (cart.length > 0) {
      return cart.find((cart) => {
        return cart.craft.craftId == craftIdx
      })!;
    }
    else {
      const response = await getCartItemsFromAPI();
      if ('error' in response) {
        setError((prev) => ({ ...prev, carts: response.error}));
        return null;
      }
      else {
        setCart(manageCart(response.items));
        return response.items.find((cart) => {
          return cart.craft.craftId == craftIdx;
        }) || null;
      }
    }
  }
  const updateCart = async (cartId: string, qty: number) => {
    setLoading((prev) => ({ ...prev, cart: true }));
    const response = await updateCartItemAPI(cartId, qty);
    setLoading((prev) => ({ ...prev, cart: false }));
    if ('error' in response) {
      setError((prev) => ({ ...prev, cart: response.error }));
      return null;
    }
    else {
      setCart((items) => [...items, response.item]);
      return response.item;
    }
  }

  return (
    <AppContext.Provider
      value={{
        cart,
        crafts,
        setCart,
        setCrafts,
        error,
        loading,
        reloadCrafts: getCrafts,
        checkInCart,
        getCraft,
        getCartItem,
        addToCart,
        updateCart
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
