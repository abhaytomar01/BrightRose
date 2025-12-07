// src/utils/apiClient.js
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_SERVER_URL ||
    "https://www.thebrightrose.com",
});

// NO TOKEN HANDLING HERE — auth.jsx controls axios defaults

export default api;
