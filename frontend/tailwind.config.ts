import type { Config } from "tailwindcss";

const config: Config = {
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
      // Agregar color personalizado
      colors: {
        'custom-blue': '#00324D',
        'custom-blues': '#39A900',
        'sena-red': '#dc2626'
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
    },
  },
  plugins: [require("tailwind-animation-delay")],
};

export default config;
