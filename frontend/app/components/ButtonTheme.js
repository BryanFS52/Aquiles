import { useState, useEffect } from "react";

// Componente que maneja el modo oscuro
const ButtonTheme = () => {
    // Leer el tema guardado en localStorage o usar el tema del sistema
    const getInitialTheme = () => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) return savedTheme;
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return "light";
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // Función para cambiar el tema
    const changeTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme); // Guardar el tema en localStorage
            return newTheme;
        });
    };

    // Aplicar el tema al cargar el componente
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    return (
        <div className="flex items-center gap-4 py-3 px-4 hover:bg-gray-500 rounded-xl transition-colors">
            <button onClick={changeTheme} className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                {theme === "light" ? "Modo Oscuro 🌙" : "Modo Claro ☀️"}
            </button>
        </div>
    );
};

export default ButtonTheme;
