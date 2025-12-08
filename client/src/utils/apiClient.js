// src/utils/apiClient.js
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_SERVER_URL ||
    "https://www.thebrightrose.com",
});

// Correct Token Logic
api.interceptors.request.use((config) => {
  try {
    const adminRaw = localStorage.getItem("auth_admin");
    const userRaw = localStorage.getItem("auth_user");

    const adminToken = adminRaw ? JSON.parse(adminRaw)?.token : null;
    const userToken = userRaw ? JSON.parse(userRaw)?.token : null;

    // 👉 If calling admin APIs → use admin token ONLY
    if (config.url.includes("/admin")) {
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
      return config;
    }

    // 👉 For all normal APIs → use user token
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

  } catch (e) {
    console.error("Token attach error:", e);
  }

  return config;
});

export default api;
