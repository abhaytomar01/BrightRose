// src/api/cart.js
import axios from "axios";

export const fetchMyCart = async (token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/cart/my-cart`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const addToCartAPI = async (token, body) => {
  return axios.post(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/cart/add`,
    body,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateCartItemAPI = async (token, key, body) => {
  return axios.put(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/cart/update/${key}`,
    body,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const removeCartItemAPI = async (token, key) => {
  return axios.delete(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/cart/remove/${key}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const clearCartAPI = async (token) => {
  return axios.delete(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/cart/clear`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
