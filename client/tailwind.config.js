/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
        'primary-red': '#AD000F',
        'gold': '#D4AF37',
        'page-white': '#ffffff',
        'section-bg': '#F8F6F3',
        'neutral-light': '#E6E6E6',
        // 'neutral-dark': '#333333',
        'text':  '2C2C2C',
        'second-bg': 'F1F1F1',
            },
            fontFamily: {
        playfair: ['Playfair Display', 'serif'],
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