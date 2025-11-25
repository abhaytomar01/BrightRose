// src/utils/apiClient.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "/api/v1",
  // you can set other defaults here
});

// Attach token from localStorage (key: "auth") automatically
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.token || "";
        if (token) {
          // always send "Bearer <token>"
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      // ignore
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
