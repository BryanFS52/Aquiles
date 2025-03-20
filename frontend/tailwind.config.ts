import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'kiwi-marumaru': ['Kiwi Maru', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'darkBlue': '#00304D',
        'shadowBlue': '#1e293b',
        'lightGray': '#E4E4E5',
        'darkGreen': '#007832',
        'lightGreen': '#39A900',
        'white': '#ffffff'
      },
      keyframes: {
        showContent: {
          to: {
            transform: "translateY(0)",
            filter: "blur(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "show-Content": "showContent 0.5s 0.7s ease-in-out 1 forwards ",
      },
      screens: {
        'xs': '360px',  // Teléfonos pequeños
        'sm': '640px',  // Teléfonos grandes
        'md': '768px',  // Tablets
        'lg': '1024px', // Laptops
        'xl': '1280px', // Monitores grandes
        '2xl': '1536px' // Pantallas extra grandes
      }
    },
  },
  plugins: [],
};

export default config;
