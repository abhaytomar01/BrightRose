// src/api/wishlist.js
// Updated to match backend routes and use apiClient (auto token header)

import api from "../utils/apiClient";

const BASE = "/api/v1/wishlist";

/**
 * Toggle wishlist entry on backend.
 * Backend route: POST /api/v1/wishlist/toggle
 *
 * Returns the axios promise.
 */
export const toggleWishlistAPI = (productId, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  return api.post(`${BASE}/toggle`, { productId }, config);
};

/**
 * Legacy-friendly: add to wishlist.
 * ↳ Uses toggle endpoint (backend maintains presence). Consumers expecting
 * an "add" action can keep calling this.
 */
export const addToWishlistAPI = (productId, token) => {
  return toggleWishlistAPI(productId, token);
};

/**
 * Legacy-friendly: remove from wishlist.
 * ↳ Uses toggle endpoint (backend maintains presence). Consumers expecting
 * a "remove" action can keep calling this.
 */
export const removeFromWishlistAPI = (productId, token) => {
  return toggleWishlistAPI(productId, token);
};

/**
 * Fetch wishlist.
 * Backend route: GET /api/v1/wishlist
 */
export const getWishlistAPI = (token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  return api.get(BASE, config);
};
