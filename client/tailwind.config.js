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
        // Set default theme background color if needed
        page: '#FFFFFF',
      },
      boxShadow: {
                primaryShadow: "0px_0px_8px_2px_rgba(212,212,212,0.6)",
            },
        },
    },
    plugins: [],
};



// 'primary-red': '#ff0000',
//         'gold': '#FFD166',
//         'white': '#FFFFFF',
//         'custom-bg': '#fdf6f1',
//         'neutral-light': '#F5F5F5',
//         'neutral-dark': '#333333',
//         'muted-warm-gray': '#A8A8A8',
//         'muted-cool-gray': '#D9D9D9',