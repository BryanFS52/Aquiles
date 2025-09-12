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
        'darkBackground': '#001829',
        'white': '#ffffff',
        'grayText': '#9ca3af',
        'black': '#000000',
        // Colores específicos para modo oscuro con el color correcto #00304d
        'dark': {
          'sidebar': '#00304d',        // Color principal más oscuro
          'sidebarGradient': '#001829', // Para degradados
          'main': '#001829',           // Fondo principal muy oscuro
          'card': '#1e293b',           // Tarjetas en azul grisáceo
          'cardHover': '#334155',      // Hover de tarjetas
          'text': '#ffffff',           // Texto principal blanco
          'textSecondary': '#94a3b8',  // Texto secundario gris claro
          'border': '#334155',         // Bordes sutiles
          'accent': '#0ea5e9',         // Azul de acento para elementos activos
          'accentHover': '#0284c7',    // Hover del acento
        }
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
