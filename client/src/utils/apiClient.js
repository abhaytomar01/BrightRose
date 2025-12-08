// src/utils/apiClient.js
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_SERVER_URL ||
    "https://www.thebrightrose.com",
});

// Attach token for BOTH admin and user
api.interceptors.request.use((config) => {
  try {
    const adminRaw = localStorage.getItem("auth_admin");
    const userRaw = localStorage.getItem("auth_user");

    let token = null;

    if (adminRaw) token = JSON.parse(adminRaw)?.token;
    if (!token && userRaw) token = JSON.parse(userRaw)?.token;

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error("Token attach error:", e);
  }

  return config;
});

export default api;
