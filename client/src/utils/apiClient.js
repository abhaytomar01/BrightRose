// src/utils/apiClient.js
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_SERVER_URL ||
    "https://www.thebrightrose.com", // fallback for production
});

// AUTO ATTACH TOKENS
api.interceptors.request.use(
  (config) => {
    try {
      const admin = localStorage.getItem("auth_admin");
      const user = localStorage.getItem("auth_user");

      let token = null;

      if (admin) token = JSON.parse(admin)?.token;
      if (!token && user) token = JSON.parse(user)?.token;

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Token attach error:", e);
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
