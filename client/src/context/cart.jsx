// context/cart.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useAuth } from "./auth";

const LOCAL_KEY_PREFIX = "brightrose_cart_v1";
const LOCAL_SAVE_LATER_PREFIX = "brightrose_saveLater_v1";

const CartContext = createContext();

const makeKey = (productId, size = "", color = "") =>
  `${productId || ""}::${size || ""}::${color || ""}`;

export const CartProvider = ({ children }) => {
  let authUserId = "guest";

  try {
    const authCtx = useAuth();
    if (authCtx && authCtx.authUser?.user?._id) {
      authUserId = authCtx.authUser.user._id;
    }
  } catch {
    // AuthProvider not mounted yet – fall back to guest
    authUserId = "guest";
  }

  const userId = authUserId;
  const CART_KEY = `brightrose_cart_v1_${userId}`;
  const SAVE_LATER_KEY = `brightrose_saveLater_v1_${userId}`;

  // -----------------------------
  // Load Cart & Save-Later Items
  // -----------------------------
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [saveLaterItems, setSaveLaterItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SAVE_LATER_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(null);
  const [country, setCountry] = useState("India");

  // Save into localStorage per user
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems, CART_KEY]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_LATER_KEY, JSON.stringify(saveLaterItems));
    } catch {}
  }, [saveLaterItems, SAVE_LATER_KEY]);

  // When user changes, reload that user's cart
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      setCartItems(stored ? JSON.parse(stored) : []);
    } catch {
      setCartItems([]);
    }

    try {
      const storedSave = localStorage.getItem(SAVE_LATER_KEY);
      setSaveLaterItems(storedSave ? JSON.parse(storedSave) : []);
    } catch {
      setSaveLaterItems([]);
    }
  }, [CART_KEY, SAVE_LATER_KEY]);

  // -----------------------------
  // Normalize product structure
  // -----------------------------
  const normalize = (product, qty = 1, opts = {}) => {
    const { size = "", color = "" } = opts;

    const id = product._id || product.productId || product.id;
    const key = makeKey(id, size, color);

    return {
      key,
      _id: id,
      name: product.name || product.title || "",
      price: Number(product.price) || 0,
      discountPrice: Number(product.discountPrice ?? product.price) || 0,
      quantity: Math.max(1, qty),
      selectedSize: size,
      selectedColor: color,
      stock: Number(product.stock ?? 9999),
      image: product.images?.[0]?.url || product.image || "",
      rawProduct: product,
    };
  };

  const addToCart = (product, qty = 1, opts = {}) => {
    if (!product || !(product._id || product.productId)) {
      toast.error("Invalid product");
      return;
    }

    const item = normalize(product, qty, opts);

    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.key === item.key);
      const updated = [...prev];

      if (idx !== -1) {
        const existing = updated[idx];
        const newQty = Math.min(existing.quantity + qty, existing.stock);
        updated[idx] = { ...existing, quantity: newQty };
      } else {
        updated.unshift({ ...item, quantity: Math.min(qty, item.stock) });
      }

      toast.success("Cart updated");
      return updated;
    });
  };

  const updateQuantity = (key, qty) => {
    setCartItems((prev) =>
      prev.map((it) =>
        it.key === key
          ? { ...it, quantity: Math.max(1, Math.min(qty, it.stock)) }
          : it
      )
    );
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((it) => it.key !== key));
  };

  const moveToSaveLater = (key) => {
    setCartItems((prevCart) => {
      const idx = prevCart.findIndex((it) => it.key === key);
      if (idx === -1) return prevCart;

      const [item] = prevCart.splice(idx, 1);
      setSaveLaterItems((prev) => [item, ...prev]);

      return [...prevCart];
    });
  };

  const moveToCartFromSaveLater = (key, qty = 1) => {
    setSaveLaterItems((prev) => {
      const idx = prev.findIndex((it) => it.key === key);
      if (idx === -1) return prev;

      const [item] = prev.splice(idx, 1);
      addToCart(item.rawProduct || item, qty, {
        size: item.selectedSize,
        color: item.selectedColor,
      });

      return [...prev];
    });
  };

  const removeFromSaveLater = (key) => {
    setSaveLaterItems((prev) => prev.filter((it) => it.key !== key));
  };

  const clearCart = () => setCartItems([]);

  const { subtotal, totalItems } = useMemo(() => {
    return cartItems.reduce(
      (acc, it) => {
        const price = Number(it.discountPrice ?? it.price);
        acc.subtotal += price * it.quantity;
        acc.totalItems += it.quantity;
        return acc;
      },
      { subtotal: 0, totalItems: 0 }
    );
  }, [cartItems]);

  const shipping = 0;
  const gstRate = 12;
  const tax = Number(((subtotal * gstRate) / (100 + gstRate)).toFixed(2));
  const discount = Number(coupon?.amount || 0);
  const grandTotal = Number((subtotal - discount).toFixed(2));

  const value = {
    cartItems,
    saveLaterItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    moveToSaveLater,
    moveToCartFromSaveLater,
    removeFromSaveLater,
    clearCart,

    subtotal,
    shipping,
    tax,
    discount,
    grandTotal,
    totalItems,

    coupon,
    setCoupon,

    country,
    setCountry,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
