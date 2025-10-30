import { createContext, useEffect, useEffectEvent, useState } from "react";
import type { Handicrafts } from "../types/handicrafts";
import type { CartItem } from "../types/cart";
import { addToCartAPI, getCartItemsFromAPI } from "../services/cart";
import { manageCart } from "../utils/cart-functions";
import { getCraftFromAPI, getCraftsFromAPI } from "../services/home";
import { useLocation } from "react-router-dom";
import fingerprint from "../utils/fingerprint";

type AppContextType = {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;

  crafts: Handicrafts[];
  setCrafts: (crafts: Handicrafts[]) => void;

  error: { cart: string; crafts: string, craft: string };
  loading: { cart: boolean; crafts: boolean, craft: boolean };

  reloadCrafts: () => void;
  checkInCart: (craftId: string) => boolean;
  getCraft: (craftId: string) => Promise<Handicrafts | null>;
  addToCart: (item: Handicrafts) => Promise<boolean>
};

export const AppContext = createContext<AppContextType>({
  cart: [],
  crafts: [],
  setCart: () => {},
  setCrafts: () => {},
  error: { cart: "", crafts: "", craft: "" },
  loading: { cart: false, crafts: false, craft: false },
  reloadCrafts: () => {},
  checkInCart: () => false,
  getCraft: async () => null,
  addToCart: async () => false,
});

interface Props {
  children: React.ReactNode | React.ReactNode[];
}
export function AppProvider(props: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [crafts, setCrafts] = useState<Handicrafts[]>([]);
  const [error, setError] = useState<AppContextType["error"]>({
    cart: "", crafts: "", craft: ""
  });
  const [loading, setLoading] = useState<AppContextType["loading"]>({
    cart: false, crafts: false, craft: false
  });

  const location = useLocation();

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

  const addToCart = async (item: Handicrafts) => {
    const added = await addToCartAPI(item);
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
            qty: 1,
            updatedAt: new Date().toISOString()
        }

        setCart((prev) => ([...prev, cart]));
        return true;
    }
    else return false;
  }

  const getCraft = async (craftIdx: string) => {
    const craft = crafts.find(({ craftId }) => craftId == craftIdx);
    if (!craft) {
        setLoading((prev) => ({ ...prev, craft: true }));
        const response = await getCraftFromAPI(craftIdx);
        if ('error' in response) {
            setError((prev) => ({ ...prev, craft: response.error }));
            setLoading((prev) => ({ ...prev, craft: false }));
            return null;
        }
        else {
            setCrafts((prev) => ([...prev, response]));
            setLoading((prev) => ({ ...prev, craft: false }));
            return response;
        }
    }
    else return craft;
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
        addToCart
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
