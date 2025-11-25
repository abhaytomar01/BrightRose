// src/utils/apiClient.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// Attach correct tokens
api.interceptors.request.use(
  (config) => {
    try {
      const adminRaw = localStorage.getItem("auth_admin");
      const userRaw = localStorage.getItem("auth_user");

      let token = "";

      if (adminRaw) token = JSON.parse(adminRaw)?.token;
      else if (userRaw) token = JSON.parse(userRaw)?.token;

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
