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
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary': {
          DEFAULT: '#398F0F',
          light: '#84CC16',
        },
        'secondary': {
          DEFAULT: '#00304D',
          light: '#39A900',
        },
        'darkBlue': '#005386',
        'shadowBlue': '#00304d',
        'lightGray': '#E4E4E5',
        'darkGray': '#5e5c5c',
        'lightGreen': '#39A900',
        'darkGreen': '#007832',
        'darkBackground': '#dfdddd',
        'white': '#ffffff',
        'grayText': '#9ca3af',
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
        'xs': '360px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      }
    },
  },
  plugins: [],
};

export default config;