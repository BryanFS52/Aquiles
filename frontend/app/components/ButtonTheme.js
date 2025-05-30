"use client"; // Si estás usando Next.js con app router

import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

// Componente que maneja el modo oscuro
const ButtonTheme = () => {
    const [theme, setTheme] = useState("light"); // valor inicial seguro
    const [mounted, setMounted] = useState(false); // asegura render en cliente

    // Obtener tema desde localStorage o sistema, solo en cliente
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));
        setMounted(true);
    }, []);

    // Aplicar la clase al html
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    // Cambiar tema
    const changeTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    };

    if (!mounted) return null; // Previene hydration mismatch

    return (
        <div className="mt-auto w-full flex items-center justify-center mb-4 space-x-4">
            <FaSun className="w-10 h-10 text-yellow-400" />

            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={changeTheme}
                    className="sr-only peer"
                />
                <div className="w-20 h-9 bg-lightGray peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white rounded-full peer transition-all">
                    <span
                        className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform flex items-center justify-center ${theme === "dark" ? "translate-x-11" : "translate-x-0"
                            }`}
                    />
                </div>
            </label>

            <FaMoon className="w-10 h-10 text-white" />
        </div>
    );
};

export default ButtonTheme;
