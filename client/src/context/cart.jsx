import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const LOCAL_KEY = "brightrose_cart_v1";
const LOCAL_SAVE_LATER = "brightrose_saveLater_v1";

const CartContext = createContext();

const makeKey = (productId, size = "", color = "") =>
  `${productId || ""}::${size || ""}::${color || ""}`;

export const CartProvider = ({ children }) => {
  // --- Load from localStorage safely
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [saveLaterItems, setSaveLaterItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SAVE_LATER);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(null);

  // --- Persist with debounced effect to avoid over-writes
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(LOCAL_SAVE_LATER, JSON.stringify(saveLaterItems));
  }, [saveLaterItems]);

  // --- Normalize item
  const normalize = (product, qty = 1, opts = {}) => {
    const { size = "", color = "" } = opts;
    const id = product._id || product.productId || product.id;
    const key = makeKey(id, size, color);

    return {
      key,
      _id: id,
      name: product.name || product.title || "Unnamed Product",
      price: Number(product.price) || 0,
      discountPrice: Number(product.discountPrice ?? product.price) || 0,
      quantity: Math.max(1, qty),
      selectedSize: size,
      selectedColor: color,
      stock: Number(product.stock ?? product.available ?? 9999),
      image: product.images?.[0]?.url || product.image || product.img || "",
      rawProduct: product,
    };
  };

  // --- Add to cart (handles merging and stock limits)
  const addToCart = (product, qty = 1, opts = {}) => {
    if (!product || !(product._id || product.productId || product.id)) {
      toast.error("Invalid product data");
      return;
    }

    const item = normalize(product, qty, opts);

    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.key === item.key);
      const updated = [...prev];

      if (idx !== -1) { 
        const existing = updated[idx];
        const newQty = Math.min(existing.quantity + qty, existing.stock);
        if (newQty === existing.quantity) {
          toast.info("Max stock reached");
          return updated;
        }
        updated[idx] = { ...existing, quantity: newQty };
        toast.success("Cart updated");
      } else {
        const toAdd = { ...item, quantity: Math.min(qty, item.stock) };
        updated.unshift(toAdd);
        toast.success("Product added to cart");
      }
      return updated;
    });
  };

  // --- Update quantity directly (safe boundaries)
  const updateQuantity = (key, qty) => {
    setCartItems((prev) => {
      const updated = prev.map((it) => {
        if (it.key !== key) return it;
        const bounded = Math.max(1, Math.min(qty, it.stock));
        return { ...it, quantity: bounded };
      });
      return updated;
    });
  };

  // --- Remove from cart
  const removeFromCart = (key) => {
    setCartItems((prev) => {
      const updated = prev.filter((it) => it.key !== key);
      if (updated.length !== prev.length) toast.info("Removed from cart");
      return updated;
    });
  };

  // --- Move to save later
  const moveToSaveLater = (key) => {
    setCartItems((prevCart) => {
      const idx = prevCart.findIndex((it) => it.key === key);
      if (idx === -1) return prevCart;

      const [item] = prevCart.splice(idx, 1);
      setSaveLaterItems((prev) => {
        const exists = prev.some((p) => p.key === item.key);
        if (!exists) return [item, ...prev];
        return prev;
      });
      toast.success("Moved to Save for Later");
      return [...prevCart];
    });
  };

  // --- Move from save later to cart
  const moveToCartFromSaveLater = (key, qty = 1) => {
    setSaveLaterItems((prev) => {
      const idx = prev.findIndex((it) => it.key === key);
      if (idx === -1) return prev;
      const [item] = prev.splice(idx, 1);

      addToCart(item.rawProduct || item, qty, {
        size: item.selectedSize,
        color: item.selectedColor,
      });
      toast.success("Moved to Cart");
      return [...prev];
    });
  };

  // --- Remove from save later
  const removeFromSaveLater = (key) => {
    setSaveLaterItems((prev) => {
      const updated = prev.filter((it) => it.key !== key);
      if (updated.length !== prev.length) toast.info("Removed from Save for Later");
      return updated;
    });
  };

  // --- Clear cart safely
  const clearCart = () => {
    if (cartItems.length === 0) {
      toast.info("Cart is already empty");
      return;
    }
    setCartItems([]);
    toast.info("Cart cleared");
  };

  // --- Computed totals
  const { subtotal, totalItems } = useMemo(() => {
    return cartItems.reduce(
      (acc, it) => {
        const price = Number(it.discountPrice ?? it.price ?? 0);
        const qty = Number(it.quantity || 0);
        acc.subtotal += price * qty;
        acc.totalItems += qty;
        return acc;
      },
      { subtotal: 0, totalItems: 0 }
    );
  }, [cartItems]);

  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 49;
  const taxRate = 0.12;
  const tax = +(subtotal * taxRate).toFixed(2);
  const discount = Number(coupon?.amount || 0);
  const grandTotal = +(subtotal + shipping + tax - discount).toFixed(2);

  // --- Final context value
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
    setCoupon,
    coupon,
    subtotal,
    shipping,
    tax,
    discount,
    grandTotal,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
