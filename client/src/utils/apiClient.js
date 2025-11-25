// src/utils/apiClient.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "/api/v1",
});

// --- Interceptor to attach correct token ---
api.interceptors.request.use(
  (config) => {
    try {
      const admin = localStorage.getItem("auth_admin");
      const user = localStorage.getItem("auth_user");

      let token = "";

      // ADMIN API ALWAYS STARTS WITH /auth/admin-*
      if (config.url.includes("/admin")) {
        token = admin ? JSON.parse(admin).token : "";
      } else {
        token = user ? JSON.parse(user).token : "";
      }

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Token attach failed:", err);
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
