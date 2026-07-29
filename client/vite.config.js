/* eslint-disable no-unused-vars */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // React core — changes almost never
                    "vendor-react": ["react", "react-dom"],
                    // Router — stable
                    "vendor-router": ["react-router-dom"],
                    // UI / animation — only changes when you upgrade
                    "vendor-ui": ["framer-motion", "@mui/material", "@emotion/react", "@emotion/styled"],
                    // Data fetching — stable
                    "vendor-axios": ["axios"],
                },
            },
        },
        // Warn if any single chunk exceeds 500 KB
        chunkSizeWarningLimit: 500,
    },
    // server: {
    //     proxy: {
    //         // Proxy /api requests to your backend server
    //         "/api": {
    //             target: "https://e-commerce-mgtd.onrender.com", // Replace with your backend server URL
    //             changeOrigin: true,
    //             secure: false,
    //             configure: (proxy, _options) => {
    //                 proxy.on("error", (err, _req, _res) => {
    //                     console.log("proxy error", err);
    //                 });
    //                 proxy.on("proxyReq", (proxyReq, req, _res) => {
    //                     console.log(
    //                         "Sending Request to the Target:",
    //                         req.method,
    //                         req.url
    //                     );
    //                 });
    //                 proxy.on("proxyRes", (proxyRes, req, _res) => {
    //                     console.log(
    //                         "Received Response from the Target:",
    //                         proxyRes.statusCode,
    //                         req.url
    //                     );
    //                 });
    //             },
    //         },
    // },
    // },

});
