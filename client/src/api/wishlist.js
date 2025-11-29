// src/api/wishlist.js
import axios from "axios";

const API = `${import.meta.env.VITE_SERVER_URL}/api/v1/wishlist`;

// ✅ Get wishlist (returns product IDs or objects depending backend)
export const getWishlistAPI = async (token) => {
  return axios.get(`${API}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Toggle wishlist add/remove
export const toggleWishlistAPI = async (productId, token) => {
  return axios.post(
    `${API}/toggle`,
    { productId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
