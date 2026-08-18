import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { PRODUCTS } from "@/data/mock";
import type { Product } from "@/data/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LastOrder {
  number: string;
  total: number;
  method: "payme" | "click";
  tracking: string;
}

interface ShopState {
  cart: CartItem[];
  cartCount: number;
  itemsTotal: number;
  discountTotal: number;
  wishlist: string[];
  wishlistProducts: Product[];
  cartOpen: boolean;
  searchOpen: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isWished: (id: string) => boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  lastOrder: LastOrder | null;
  setLastOrder: (o: LastOrder | null) => void;
}

const ShopContext = createContext<ShopState | null>(null);

const CART_KEY = "rqvonbrend.cart";
const WISH_KEY = "rqvonbrend.wishlist";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<{ id: string; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      const w = localStorage.getItem(WISH_KEY);
      if (c) setLines(JSON.parse(c) as { id: string; quantity: number }[]);
      if (w) setWishlist(JSON.parse(w) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  useEffect(() => {
    try {
      localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    } catch {
      /* ignore */
    }
  }, [wishlist]);

  const cart = useMemo<CartItem[]>(
    () =>
      lines
        .map((l) => {
          const product = PRODUCTS.find((p) => p.id === l.id);
          return product ? { product, quantity: l.quantity } : null;
        })
        .filter((x): x is CartItem => x !== null),
    [lines],
  );

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.id === product.id
            ? { ...l, quantity: Math.min(l.quantity + quantity, Math.max(product.stock, 1)) }
            : l,
        );
      }
      return [...prev, { id: product.id, quantity }];
    });
    toast.success("Savatchaga qo'shildi", { description: product.name });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, quantity } : l)),
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        toast("Sevimlilardan olib tashlandi", { description: product.name });
        return prev.filter((x) => x !== product.id);
      }
      toast.success("Sevimlilarga qo'shildi", { description: product.name });
      return [...prev, product.id];
    });
  }, []);

  const value = useMemo<ShopState>(() => {
    const itemsTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const discountTotal = cart.reduce(
      (s, i) => s + (i.product.oldPrice ? (i.product.oldPrice - i.product.price) * i.quantity : 0),
      0,
    );
    return {
      cart,
      cartCount: cart.reduce((s, i) => s + i.quantity, 0),
      itemsTotal,
      discountTotal,
      wishlist,
      wishlistProducts: PRODUCTS.filter((p) => wishlist.includes(p.id)),
      cartOpen,
      searchOpen,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      toggleWishlist,
      isWished: (id: string) => wishlist.includes(id),
      setCartOpen,
      setSearchOpen,
      lastOrder,
      setLastOrder,
    };
  }, [
    cart,
    wishlist,
    cartOpen,
    searchOpen,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    toggleWishlist,
    lastOrder,
  ]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopState {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop ShopProvider ichida ishlatilishi kerak");
  return ctx;
}
