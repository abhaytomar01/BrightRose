/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryRed: '#AD000F',
        accentGold: "#d4af37",
        neutralLight: "#f7f7f7",
        neutralDark: "#444444",
        mutedGray: "#d9d9d9",
        pureWhite: "#ffffff",
      },
      backgroundColor: {
        page: '#FFFFFF',
      },
      boxShadow: {
        primaryShadow: "0px_0px_8px_2px_rgba(212,212,212,0.6)",
      },
      // Add this for anti-pixelation
      utilities: {
        '.image-auto': {
          imageRendering: 'auto',
        },
        '.image-crisp': {
          imageRendering: '-webkit-optimize-contrast',
          imageRendering: '-moz-crisp-edges',
          imageRendering: 'crisp-edges',
          imageRendering: 'pixelated',
        },
      },
    },
  },
  plugins: [],
};
