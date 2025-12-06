import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const LOCAL_KEY = "brightrose_cart_v1";
const LOCAL_SAVE_LATER = "brightrose_saveLater_v1";

const CartContext = createContext();

const makeKey = (productId, size = "", color = "") =>
  `${productId || ""}::${size || ""}::${color || ""}`;

export const CartProvider = ({ children }) => {
  // -----------------------------
  // Load Cart & Save-Later Items
  // -----------------------------
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [saveLaterItems, setSaveLaterItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_SAVE_LATER)) || [];
    } catch {
      return [];
    }
  });

  // Coupon storage
  const [coupon, setCoupon] = useState(null);

  // USER COUNTRY (needed for shipping)
  const [country, setCountry] = useState("India");

  // Save into localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(LOCAL_SAVE_LATER, JSON.stringify(saveLaterItems));
  }, [saveLaterItems]);

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

  // ADD TO CART
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

  // UPDATE ITEM QTY
  const updateQuantity = (key, qty) => {
    setCartItems((prev) =>
      prev.map((it) =>
        it.key === key
          ? { ...it, quantity: Math.max(1, Math.min(qty, it.stock)) }
          : it
      )
    );
  };

  // REMOVE FROM CART
  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((it) => it.key !== key));
  };

  // SAVE FOR LATER
  const moveToSaveLater = (key) => {
    setCartItems((prevCart) => {
      const idx = prevCart.findIndex((it) => it.key === key);
      if (idx === -1) return prevCart;

      const [item] = prevCart.splice(idx, 1);
      setSaveLaterItems((prev) => [item, ...prev]);

      return [...prevCart];
    });
  };

  // MOVE BACK TO CART
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

  // -----------------------------
  // TOTAL CALCULATIONS
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

  // -----------------------------------
  // SHIPPING WILL BE CALCULATED IN CHECKOUT (Delhivery API)
  // So remove shipping from here!
  // -----------------------------------
  const shipping = 0; // Always 0 (Now handled by checkout)

  // GST Included — Extract effective GST (12%)
  const gstRate = 12;
  const tax = Number(((subtotal * gstRate) / (100 + gstRate)).toFixed(2));

  const discount = Number(coupon?.amount || 0);

  // GrandTotal WITHOUT SHIPPING (Checkout will add)
  const grandTotal = Number((subtotal - discount).toFixed(2));

  // -----------------------------
  // CONTEXT VALUE
  // -----------------------------
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
    shipping, // ALWAYS 0 here
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
