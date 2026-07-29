// src/context/cart.jsx
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
import {
  fetchMyCart,
  addToCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from "../api/cart";
import { trackEvent } from "../components/Analytics/pixelUtils";

const CartContext = createContext();

const makeKey = (productId, size = "", color = "") =>
  `${productId || ""}::${size || ""}::${color || ""}`;

export const CartProvider = ({ children }) => {
  // SAFELY access auth; if used outside AuthProvider, authCtx will be undefined
  let authUser = null;
  try {
    const authCtx = useAuth();
    authUser = authCtx?.authUser || null;
  } catch {
    authUser = null;
  }

  const authUserId = authUser?.user?._id || "guest";
  const userId = authUserId;
  const token = authUser?.token || "";
  const hasToken = !!token && userId !== "guest";

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

  // For logged-in users, sync cart from server (with guest cart merging)
  useEffect(() => {
    const syncFromServer = async () => {
      if (!hasToken) return;

      try {
        // ── Step 1: Check for guest cart items in localStorage ──
        const GUEST_KEY = `brightrose_cart_v1_guest`;
        let guestItems = [];
        try {
          guestItems = JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
        } catch { guestItems = []; }

        // ── Step 2: Push guest items to server ──
        if (guestItems.length > 0) {
          const mergePromises = guestItems.map((item) =>
            addToCartAPI(token, {
              productId: item._id,
              quantity: item.quantity,
              size: item.selectedSize || "",
            }).catch((err) => console.warn("Cart merge error for item:", item._id, err))
          );
          await Promise.allSettled(mergePromises);
          // Clear the guest cart after merging
          localStorage.removeItem(GUEST_KEY);
        }

        // ── Step 3: Fetch the combined (merged) cart from server ──
        const data = await fetchMyCart(token);
        const serverItems = (data.cartItems || []).map((doc) => ({
          key: doc.key || doc._id,
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
  }, [hasToken, token, CART_KEY]);

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

    // Always update local state (guest + logged-in)
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

    // Track AddToCart Event
    trackEvent('AddToCart', {
      content_ids: [item._id],
      content_name: item.name,
      content_type: 'product',
      value: item.price * qty,
      currency: 'INR',
      quantity: qty
    });

    toast.success("Cart updated");

    // Sync with server only for logged-in users
    if (hasToken) {
      try {
        await addToCartAPI(token, {
          productId: product._id || product.productId,
          quantity: qty,
          size: opts.size || "",
        }); // ✅ Bearer token
      } catch (err) {
        console.error("ADD CART API ERROR:", err);
      }
    }
  };

  const updateQuantity = (key, qty) => {
    // Always update local state
    setCartItems((prev) =>
      prev.map((it) =>
        it.key === key
          ? { ...it, quantity: Math.max(1, Math.min(qty, it.stock)) }
          : it
      )
    );

    // Sync with server only for logged-in users
    if (hasToken) {
      updateCartItemAPI(token, key, { quantity: qty }).catch((err) =>
        console.error("UPDATE CART API ERROR:", err)
      );
    }
  };

  const removeFromCart = (key) => {
    // Always update local state
    setCartItems((prev) => prev.filter((it) => it.key !== key));

    // Sync with server only for logged-in users
    if (hasToken) {
      removeCartItemAPI(token, key).catch((err) =>
        console.error("REMOVE CART API ERROR:", err)
      );
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
    // Always clear local
    setCartItems([]);
    localStorage.removeItem(CART_KEY);

    // Sync with server only for logged-in users
    if (hasToken) {
      clearCartAPI(token).catch((err) =>
        console.error("CLEAR CART API ERROR:", err)
      );
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
