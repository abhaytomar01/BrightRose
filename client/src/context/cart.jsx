// context/cart.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./auth";

const CartContext = createContext();

const makeKey = (productId, size = "", color = "") =>
  `${productId || ""}::${size || ""}::${color || ""}`;

export const CartProvider = ({ children }) => {
  const { authUser } = useAuth();
  const authUserId = authUser?.user?._id || "guest";
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

  // When userId changes, reload that user's cart from localStorage
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

  // For logged-in users, sync cart from server
  useEffect(() => {
    const syncFromServer = async () => {
      if (!authUser?.token || userId === "guest") return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/cart/my-cart`
        );
        const serverItems = (res.data.cartItems || []).map((doc) => ({
          key: doc.key || doc._id, // backend sets key = Cart _id
          _id: doc.productId,
          name: doc.name,
          price: doc.price,
          discountPrice: doc.discountPrice,
          quantity: doc.quantity,
          selectedSize: doc.size || "",
          selectedColor: doc.color || "",
          stock: doc.stock ?? 9999,
          image: doc.image || "",
          rawProduct: doc,
        }));
        setCartItems(serverItems);
        localStorage.setItem(CART_KEY, JSON.stringify(serverItems));
      } catch (err) {
        console.error("SYNC CART ERROR:", err);
      }
    };

    syncFromServer();
  }, [authUser?.token, userId, CART_KEY]);

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

  // -----------------------------
  // Cart mutations
  // -----------------------------
  const addToCart = async (product, qty = 1, opts = {}) => {
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

      return updated;
    });

    toast.success("Cart updated");

    // sync with server for logged-in users
    if (authUser?.token && userId !== "guest") {
      try {
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/cart/add`,
          {
            productId: product._id || product.productId,
            quantity: qty,
            size: opts.size || "",
          }
        );
      } catch (err) {
        console.error("ADD CART API ERROR:", err);
      }
    }
  };

  const updateQuantity = (key, qty) => {
    setCartItems((prev) =>
      prev.map((it) =>
        it.key === key
          ? { ...it, quantity: Math.max(1, Math.min(qty, it.stock)) }
          : it
      )
    );

    if (authUser?.token && userId !== "guest") {
      axios
        .put(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/cart/update/${key}`,
          { quantity: qty }
        )
        .catch((err) => console.error("UPDATE CART API ERROR:", err));
    }
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((it) => it.key !== key));

    if (authUser?.token && userId !== "guest") {
      axios
        .delete(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/cart/remove/${key}`
        )
        .catch((err) => console.error("REMOVE CART API ERROR:", err));
    }
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

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);

    if (authUser?.token && userId !== "guest") {
      axios
        .delete(`${import.meta.env.VITE_SERVER_URL}/api/v1/cart/clear`)
        .catch((err) => console.error("CLEAR CART API ERROR:", err));
    }
  };

  // -----------------------------
  // Totals
  // -----------------------------
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
