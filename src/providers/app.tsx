import { createContext, useEffect, useEffectEvent, useState } from "react";
import type { Handicrafts } from "../types/handicrafts";
import type { CartItem } from "../types/cart";
import { getCartItemsFromAPI } from "../services/cart";
import { manageCart } from "../utils/cart-functions";
import { getCraftsFromAPI } from "../services/home";

type AppContextType = {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;

  crafts: Handicrafts[];
  setCrafts: (crafts: Handicrafts[]) => void;

  error: { cart: string; crafts: string };
  loading: { cart: boolean; crafts: boolean };

  reloadCrafts: () => void;
  checkInCart: (craftId: string) => boolean;
};

export const AppContext = createContext<AppContextType>({
  cart: [],
  crafts: [],
  setCart: () => {},
  setCrafts: () => {},
  error: { cart: "", crafts: "" },
  loading: { cart: false, crafts: false },
  reloadCrafts: () => {},
  checkInCart: () => false
});

interface Props {
  children: React.ReactNode | React.ReactNode[];
}
export function AppProvider(props: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [crafts, setCrafts] = useState<Handicrafts[]>([]);
  const [error, setError] = useState<AppContextType["error"]>({
    cart: "",
    crafts: "",
  });
  const [loading, setLoading] = useState<AppContextType["loading"]>({
    cart: false,
    crafts: false,
  });

  const getCartItems = useEffectEvent(async () => {
    setCart([]);
    setLoading((prev) => ({ ...prev, cart: true }));
    const response = await getCartItemsFromAPI();
    if ("error" in response) {
      setError((prev) => ({ ...prev, cart: response.error }));
    } else {
      console.log("getCartItems response = ", response);
      setCart(manageCart(response.items));
    }
    setLoading((prev) => ({ ...prev, cart: false }));
  });
  const getCrafts = useEffectEvent(async () => {
    setCrafts([]);
    setError((prev) => ({...prev, crafts: "" }));
    setLoading((prev) => ({ ...prev, crafts: true }));
    const response = await getCraftsFromAPI();
    if ("error" in response) {
      setError((prev) => ({ ...prev, crafts: response.error }));
    } else {
      setCrafts(response);
    }
    setLoading((prev) => ({ ...prev, crafts: false }));
  });
  const checkInCart = (craftId: string) => {
    const craftIds = cart.map(({ craft }) => craft.craftId);
    return craftIds.includes(craftId);
  }

  useEffect(() => {
    getCartItems();
    getCrafts();
  }, []);

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
        checkInCart
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
