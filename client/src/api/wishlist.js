import axios from "axios";

const API = import.meta.env.VITE_SERVER_URL + "/api/v1/wishlist";

export const addToWishlistAPI = async (productId, token) => {
  return axios.post(
    `${API}/add`,
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const removeFromWishlistAPI = async (productId, token) => {
  return axios.post(
    `${API}/remove`,
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getWishlistAPI = async (token) => {
  return axios.get(`${API}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
